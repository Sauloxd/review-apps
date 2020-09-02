const io = require('@actions/io');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const indexPage = require('./template/index-page');
const { getManifest } = require('./utils/manifest');
const retry = require('./utils/retry');

module.exports = onPrClose;

async function onPrClose({
  ghBranch,
  branchName,
  pathByBranch,
  pathByHeadCommit,
  commitMessage
}) {
  await exec('git', ['checkout', ghBranch]);
  await retry(5)(async () => {
    await exec('git', ['fetch', 'origin', ghBranch]);
    await exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
    await io.rmRF(pathByBranch);
    let manifest = getManifest();
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
