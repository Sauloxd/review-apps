/* eslint-disable @typescript-eslint/no-use-before-define */
const io = require('@actions/io');
const github = require('@actions/github');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const indexPage = require('./template/index-page');
const onPrClose = require('./on-pr-close');
const { getManifest } = require('./utils/manifest');
const retry = require('./utils/retry');
const getParamsFromPayload = require('./utils/params-from-payload');

module.exports = {
  createReviewApp
};

async function createReviewApp() {
  const distDir = core.getInput('dist');
  const slug = core.getInput('slug');
  const ghBranch = core.getInput('branch');
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

  core.debug(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', true]);
  const commitMessage = `[skip ci] ref to ${headCommitId} for - ${slug}`;
  const pathByRepo = repositoryName;
  const pathByBranch = `${slug}/${branchName}`;
  const pathByHeadCommit = `${pathByBranch}/${headCommitId.substr(0, 6)}`;

  if (isClosePrEvent) {
    onPrClose({
      ghBranch,
      branchName,
      pathByBranch,
      pathByHeadCommit,
      commitMessage
    });
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
      -> Will move (and override) the build result on '${distDir}' to '${pathByHeadCommit}' in ${ghBranch}"
      -> Finally, will commit and push with the following message:"
      -> ${commitMessage}"
    `);
    await exec('mv', [distDir, '.tmp']);
    const manifest = getManifest();

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
    core.debug(JSON.stringify(manifest, null, 2));

    await exec('git', ['checkout', ghBranch]);
    await retry(5)(async () => {
      await exec('git', ['fetch', 'origin', ghBranch]);
      await exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
      await io.cp('.tmp/.', pathByHeadCommit, { recursive: true, force: true });
      fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
      fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');

      try {
        await exec('git', ['add', pathByHeadCommit, 'index.html', 'manifest.json']);
        await exec('git', ['commit', '-m', commitMessage]);
      } catch (e) {
        core.debug(e);
      }
      await exec('git', ['push', 'origin', ghBranch]);
    });
    await io.rmRF('.tmp');
  }

  await exec('git', ['fetch', 'origin', branchName]);
  await exec('git', ['checkout', branchName]);
}
