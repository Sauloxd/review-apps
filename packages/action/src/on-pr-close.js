const io = require('@actions/io');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const indexPage = require('./template/index-page');
const { getManifest, removeApp } = require('./utils/manifest');
const retry = require('./utils/retry');

module.exports = onPrClose;

async function onPrClose({
  branchName,
  commitMessage,
  ghBranch,
  pathByBranch,
  pathByHeadCommit,
  slug
}) {
  await retry(5)(async () => {
    await exec('git', ['fetch', 'origin', ghBranch]);
    await exec('git', ['checkout', ghBranch]);
    await exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
    await io.rmRF(pathByBranch);
    const manifest = removeApp({ manifest: getManifest(), branchName, slug });

    core.debug(JSON.stringify(manifest, null, 2));

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

}
