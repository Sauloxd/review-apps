import * as io from '@actions/io';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
import { retry } from '../utils/retry';
import { withError } from '../utils/log-error';
import { SanitizedPayloadParams } from '../interface';
import { userInput } from '../utils/user-input';

export const removeApp = withError(async function removeApp(
  params: SanitizedPayloadParams
) {
  await retry(5)(async () => {
    await git.hardReset(userInput().ghPagesBranch);
    await io.rmRF(params.branch.name);
    manifest.removeApp(params.branch.name);
    await git.stageChanges([
      params.branch.name,
      !userInput().skipIndexHtml && 'index.html',
      'manifest.json',
    ]);
    await git.commit(
      git.decorateMessage(`Removing branch: ${params.branch.name}`)
    );
    await git.push(userInput().ghPagesBranch);
  });
});
