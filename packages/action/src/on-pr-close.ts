import * as io from '@actions/io';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import { indexPage } from './template/index-page';
import { getManifest, removeApp } from './utils/manifest';
import { retry } from './utils/retry';

export async function onPrClose({
  branchName,
  commitMessage,
  ghBranch,
  pathByBranch,
  pathByHeadCommit,
  slug,
}) {
  await retry(5)(async () => {
    await exec('git', ['fetch', 'origin', ghBranch]);
    await exec('git', ['checkout', '-f', ghBranch]);
    await exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
    await io.rmRF(pathByBranch);
    const manifest = removeApp({ manifest: getManifest(), branchName, slug });

    core.debug(JSON.stringify(manifest, null, 2));

    fs.writeFileSync(
      'manifest.json',
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );
    fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');

    try {
      await exec('git', [
        'add',
        pathByHeadCommit,
        'index.html',
        'manifest.json',
      ]);
      await exec('git', ['commit', '-m', commitMessage]);
    } catch (e) {
      core.debug(e);
    }

    await exec('git', ['push', 'origin', ghBranch]);
  });
}
