import { retry } from '../utils/retry';
import { SanitizedPayloadParams } from '../interface';
import { userInput } from '../utils/user-input';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
import * as fileManager from '../utils/file-manager';

export async function onClosed(params: SanitizedPayloadParams) {
  const input = userInput();
  const { byHeadCommit } = fileManager.paths(params);

  await retry(5)(async () => {
    await git.hardReset(input.branch);
    await fileManager.removeAllAppsFromBranch(params);
    manifest.removeApp(params.branch.name);
    await git.stageChanges(byHeadCommit, 'index.html', 'manifest.json');
    await git.commit(
      git.decorateMessage(`Removing branch: ${params.branch.name}`)
    );
    await git.push(input.branch);
  });
}
