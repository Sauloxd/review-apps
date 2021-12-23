import { exec } from '@actions/exec';
import { debug } from '@actions/core';
import { SanitizedPayloadParams } from '../interface';
import { userInput } from '../utils/user-input';

export async function configure(params: SanitizedPayloadParams) {
  await exec('git', ['config', '--global', 'user.name', params.user.name]);
  await exec('git', ['config', '--global', 'user.email', params.user.email]);
  await exec('git', ['config', 'pull.rebase', 'true']);
}

export async function hardReset(branch: string) {
  debug('CALL hardReset');
  debug(`WITH branch: ${branch}`);
  await exec('git', ['fetch', 'origin', branch]);
  await exec('git', ['checkout', '-f', branch]);
  await exec('git', ['reset', '--hard', 'origin/' + branch]);
}

export function decorateMessage(message: string) {
  const input = userInput();

  return `[skip ci] ${input.slug} - ${message}`;
}

export async function stageChanges(...files: string[]) {
  await exec('git', ['add', ...files]);
}

export async function commit(message: string) {
  await exec('git', ['commit', '-m', decorateMessage(message)]);
}

export async function push(branch: string) {
  await exec('git', ['push', 'origin', branch]);
}

export async function getFilesFromOtherBranch(
  branch: string,
  fileOrDirName: string
) {
  await exec('git', ['checkout', branch, fileOrDirName]);
}
