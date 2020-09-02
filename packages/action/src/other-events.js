const io = require('@actions/io');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const indexPage = require('./template/index-page');
const { getManifest, replaceApp } = require('./utils/manifest');
const retry = require('./utils/retry');

module.exports = otherEvents;

async function otherEvents({
  branchName,
  buildCmd,
  commitMessage,
  distDir,
  ghBranch,
  headCommitId,
  pathByHeadCommit,
  pathByRepo,
  pullRequestUrl,
  slug
}) {
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

  await exec('git', ['fetch', 'origin', ghBranch]);
  await exec('git', ['checkout', ghBranch]);

  const manifest = replaceApp({
    manifest: getManifest(),
    branchName,
    slug,
    headCommitId,
    pathByHeadCommit,
    pullRequestUrl
  });

  core.debug(JSON.stringify(manifest, null, 2));

  const retry5 = retry(5);
  await retry5(async () => {
    await exec('git', ['fetch', 'origin', ghBranch]);
    await exec('git', ['checkout', ghBranch]);
    await exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
    core.debug('Coping .tmp/. -> ' + pathByHeadCommit);
    await io.cp('.tmp/.', pathByHeadCommit, { recursive: true, force: true });
    core.debug('Saving manifest.json');
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
    core.debug('Saving index.html');
    fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');
    await exec('git', ['status']);

    try {
      await exec('git', ['add', pathByHeadCommit]);
      await exec('git', ['add', 'index.html']);
      await exec('git', ['add', 'manifest.json']);
      await exec('git', ['commit', '-m', commitMessage]);
    } catch (e) {
      core.debug(e);
    }
    await exec('git', ['push', 'origin', ghBranch]);
  });
  await io.rmRF('.tmp');
}
