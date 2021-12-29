import * as fileManager from '../utils/file-manager';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
import { retry } from '../utils/retry';
import { withError } from '../utils/log-error';
import { SanitizedPayloadParams } from '../interface';
import { userInput } from '../utils/user-input';

export const removeApp = withError(async function removeApp(
  params: SanitizedPayloadParams
) {
  const { byHeadCommit } = fileManager.paths(params);
  const input = userInput();

  await retry(5)(async () => {
    await git.hardReset(input.branch);
    await fileManager.removeAllAppsFromBranch(params);
    manifest.removeApp(params.branch.name);
    await git.stageChanges([
      byHeadCommit,
      !input.skipIndexHtml && 'index.html',
      'manifest.json',
    ]);
    await git.commit(
      git.decorateMessage(`Removing branch: ${params.branch.name}`)
    );
    await git.push(input.branch);
  });
});
