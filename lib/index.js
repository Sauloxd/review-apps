const fs = require('fs');
const io = require('@actions/io');
const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('@actions/exec');
const indexPage = require('./template/index-page');

try {
  createReviewApps();
} catch (error) {
  core.setFailed(error.message);
  throw new error;
}

async function createReviewApps() {
  const publicAssetsDir = core.getInput('public-assets-dir');
  const outputDir = core.getInput('output-dir');
  const ghPagesSourceBranch = core.getInput('gh-pages-source-branch');
  const {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    pullRequestUrl,
    isClosePrEvent
  } = getParamsFromPayload();
  let manifest;

  core.debug(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', true]);
  const commitMessage = `[skip ci] ref to ${headCommitId}`;
  const fullPathDir = `${outputDir}/${branchName}-${headCommitId.substr(0, 6)}`;

  core.debug(`
    -> Current working branch: ${branchName}"
    -> Will move (and override) the build result on '${publicAssetsDir}' to '${fullPathDir}' in ${ghPagesSourceBranch}"
    -> Finally, will commit and push with the following message:"
    -> ${commitMessage}"
  `);

  if (isClosePrEvent) {
    await exec('git', ['fetch', 'origin', ghPagesSourceBranch]);
    await exec('git', ['checkout', ghPagesSourceBranch]);
    await io.rmRF(fullPathDir);
    manifest = getManifest();
    const apps = (manifest[outputDir] && manifest[outputDir].apps || []).filter(app => app.name !== branchName);
    manifest[outputDir] = {
      ...manifest[outputDir],
      apps
    };
  } else {
    await exec('mv', [publicAssetsDir, '.tmp']);
    await exec('git', ['fetch', 'origin', ghPagesSourceBranch]);
    await exec('git', ['checkout', ghPagesSourceBranch]);
    await io.cp('.tmp/.', fullPathDir, { recursive: true, force: true });
    manifest = getManifest();

    const apps = (manifest[outputDir] && manifest[outputDir].apps || []).filter(app => app.name !== branchName);
    manifest[outputDir] = {
      ...manifest[outputDir],
      apps: apps.concat({
        name: branchName,
        headCommitId,
        updatedAt: new Date(),
        href: `/${repositoryName}/${fullPathDir}`,
        pullRequestUrl
      })
    };
  }

  core.debug(JSON.stringify(manifest, null, 2));

  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');

  try {
    await exec('git', ['add', fullPathDir, 'index.html', 'manifest.json']);
    await exec('git', ['commit', '-m', commitMessage]);
  } catch (e) {
    core.debug(e);
  }

  await retry(5)(async () => {
    await exec('git', ['pull', 'origin', ghPagesSourceBranch]);
    await exec('git', ['push', 'origin', ghPagesSourceBranch]);
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

function getParamsFromPayload() {
  const payload = github.context.payload;
  let userName;
  let userEmail;
  let headCommitId;
  let branchName;
  let repositoryName;
  let pullRequestUrl;
  try {
    if (['opened', 'closed', 'synchronize', 'labeled'].includes(payload.action)) {
      userName = payload.sender && payload.sender.name;
      userEmail = payload.sender && payload.sender.email;
      headCommitId = payload.pull_request.head.sha;
      branchName = payload.pull_request.head.ref.split('/').pop();
      repositoryName = payload.repository.name;
      pullRequestUrl = payload.pull_request.html_url;
    }
    if (['push'].includes(payload.action)) {
      userName = payload.pusher.name;
      userEmail = payload.pusher.email;
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

  return {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    pullRequestUrl,
    isClosePrEvent: payload.action === 'closed'
  };
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
