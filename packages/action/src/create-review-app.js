/* eslint-disable @typescript-eslint/no-use-before-define */
const io = require('@actions/io');
const github = require('@actions/github');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const indexPage = require('./template/index-page');

module.exports = {
  createReviewApp,
  getParamsFromPayload
};

async function createReviewApp() {
  const distDir = core.getInput('dist');
  const slug = core.getInput('slug');
  const branch = core.getInput('branch');
  const buildCmd = core.getInput('build-cmd');
  const {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    pullRequestUrl,
    isClosePrEvent
  } = getParamsFromPayload(github.context.payload);
  let manifest;

  core.debug(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', true]);
  const commitMessage = `[skip ci] ref to ${headCommitId} for - ${slug}`;
  const pathByRepo = repositoryName;
  const pathByBranch = `${slug}/${branchName}`;
  const pathByHeadCommit = `${pathByBranch}/${headCommitId.substr(0, 6)}`;

  if (isClosePrEvent) {
    await exec('git', ['fetch', 'origin', branch]);
    await exec('git', ['checkout', branch]);
    await io.rmRF(pathByBranch);
    manifest = getManifest();
    const apps = (manifest[branchName] && manifest[branchName].apps || []).filter(app => app.name !== slug);
    manifest[branchName] = {
      ...manifest[branchName],
      apps
    };
    if (manifest[branchName].apps.length === 0) {
      manifest = Object.keys(manifest).reduce((acc, key) => {
        if (key === branchName) return acc;
        return { ...acc, [key]: manifest[key] };
      }, {});
    }
  } else {
    core.debug(`
    -> Paths:
    -> Your app will be hosted in github pages: "https://{ username }.github.io"
    -> Inside the repository name as prefix: "/{ repo }" (/${pathByRepo})
    -> And this action will append even more prefixes, so multiple apps can live inside
    -> "/{ slug }/{ branch }/{ head_commit }" (/${pathByHeadCommit})

    -> Example:
    -> "https://sauloxd.github.io/review-apps/storybook/feature-1/c1fcf15"

    -> We'll build your app with the proper PUBLIC_URL
    -> For more info:
    -> https://github.com/facebook/create-react-app/pull/937/files#diff-9b26877ecf8d15b7987c96e5a17502f6
    -> https://www.gatsbyjs.com/docs/path-prefix/
  `);

    core.debug(`
    -> Building app
  `);

    core.exportVariable('PUBLIC_URL', `/${pathByRepo}/${pathByHeadCommit}`);
    await exec(buildCmd);

    core.debug(`
    -> Current working branch: ${branchName}"
    -> Will move (and override) the build result on '${distDir}' to '${pathByHeadCommit}' in ${branch}"
    -> Finally, will commit and push with the following message:"
    -> ${commitMessage}"
  `);
    await exec('mv', [distDir, '.tmp']);
    await exec('git', ['fetch', 'origin', branch]);
    await exec('git', ['checkout', branch]);
    await io.cp('.tmp/.', pathByHeadCommit, { recursive: true, force: true });
    await io.rmRF('.tmp');
    manifest = getManifest();

    const apps = (manifest[branchName] && manifest[branchName].apps || []).filter(app => app.name !== slug);
    manifest[branchName] = {
      ...manifest[branchName],
      apps: apps.concat({
        name: slug,
        headCommitId,
        updatedAt: new Date(),
        href: pathByHeadCommit,
        pullRequestUrl
      })
    };
  }

  core.debug(JSON.stringify(manifest, null, 2));

  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');

  try {
    await exec('git', ['add', pathByHeadCommit, 'index.html', 'manifest.json']);
    await exec('git', ['commit', '-m', commitMessage]);
  } catch (e) {
    core.debug(e);
  }

  await retry(5)(async () => {
    await exec('git', ['pull', 'origin', branch]);
    await exec('git', ['push', 'origin', branch]);
  });

  await exec('git', ['fetch', 'origin', branchName]);
  await exec('git', ['checkout', branchName]);
}

function retry(times) {
  return async function r(cb, count = 0) {
    try { await cb(); } catch (e) {
      if (count < times) {
        core.debug('Retrying... ', count);
        await r(cb, count + 1);
      } else {
        core.debug('Exhausted retries: ', count);
      }
    }
  };
}

function getParamsFromPayload(payload) {
  let userName = 'review-app-action-user';
  let userEmail = 'review-app-action-email';
  let headCommitId;
  let branchName;
  let repositoryName;
  let pullRequestUrl;

  try {
    if (['opened', 'closed', 'synchronize', 'labeled'].includes(payload.action)) {
      userName = payload.sender && payload.sender.name || userName;
      userEmail = payload.sender && payload.sender.email || userEmail;
      headCommitId = payload.pull_request.head.sha;
      branchName = payload.pull_request.head.ref.split('/').pop();
      repositoryName = payload.repository.name;
      pullRequestUrl = payload.pull_request.html_url;
    }
    if (['push'].includes(payload.action) || typeof payload.action === 'undefined' ) {
      userName = payload.pusher.name || userName;
      userEmail = payload.pusher.email || userEmail;
      headCommitId = payload.head_commit.id;
      branchName = payload.ref.split('/').pop();
      repositoryName = payload.repository.name;
      pullRequestUrl = undefined;
    }
  } catch (e) {
    core.debug(e);
    core.debug(JSON.stringify(payload, null, 2));
    throw new Error('Failed to get basic parameters');
  }

  const result = {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    isClosePrEvent: payload.action === 'closed',
    ...(pullRequestUrl?{ pullRequestUrl }:{}),
    ...(payload.action?{ action: payload.action }:{})
  };

  if (Object.values(result).filter(r => typeof r === 'undefined').length !== 0) {
    core.debug('-> A value is undefined');
    core.debug(JSON.stringify(payload, null, 2));
  }

  core.debug('-> Metadata:');
  core.debug(JSON.stringify(result, null, 2));

  return result;
}

function getManifest () {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    core.debug(e);
    manifest = {};
  }

  return manifest;
}
