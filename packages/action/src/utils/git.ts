import { exec } from '@actions/exec';
import { SanitizedPayloadParams } from '../interface';
import { userInput } from '../utils/user-input';
import { withError } from './log-error';

export const configure = withError(async function configure(
  params: SanitizedPayloadParams
) {
  await exec('git', ['--version']);
  await exec('git', ['config', '--global', 'user.name', params.user.name]);
  await exec('git', ['config', '--global', 'user.email', params.user.email]);
  await exec('git', ['config', 'pull.rebase', 'true']);
});

export const hardReset = withError(async function hardReset(branch: string) {
  await exec('git', ['fetch', 'origin', branch]);
  await exec('git', ['checkout', '-f', branch]);
  await exec('git', ['reset', '--hard', 'origin/' + branch]);
});

export function decorateMessage(message: string) {
  const input = userInput();

  return `[skip ci] ${input.slug} - ${message}`;
}

export const stageChanges = withError(async function stageChanges(
  ...files: string[]
) {
  await exec('git', ['add', '-f', ...files]);
});

export const commit = withError(async function commit(message: string) {
  await exec('git', ['commit', '-m', decorateMessage(message)]);
});

export const push = withError(async function push(branch: string) {
  await exec('git', ['push', 'origin', branch]);
});

export const getFilesFromOtherBranch = withError(
  async function getFilesFromOtherBranch(
    branch: string,
    fileOrDirName: string
  ) {
    await exec('git', ['checkout', '-f', branch, fileOrDirName]);
  }
);
