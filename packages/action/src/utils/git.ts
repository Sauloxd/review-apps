import { exec } from '@actions/exec';
import { withError } from './log-error';
import { userInput } from './user-input';

export const configure = withError(async function configure({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  await exec('git', ['--version']);
  await exec('git', ['config', '--global', 'user.name', name]);
  await exec('git', ['config', '--global', 'user.email', email]);
  await exec('git', ['config', 'pull.rebase', 'true']);
  await exec(`echo "${userInput().tmpDir}" >> .git/info/exclude`);
});

export const hardReset = withError(async function hardReset(branch: string) {
  await exec('git', ['fetch', 'origin', branch]);
  await exec('git', ['checkout', '-f', branch]);
  await exec('git', ['reset', '--hard', 'origin/' + branch]);
});

export function decorateMessage(message: string) {
  return `[skip ci] - ${message}`;
}

export const stageChanges = withError(async function stageChanges(
  files: (string | boolean)[]
) {
  await exec('git', ['add', '-f', ...(files.filter(Boolean) as string[])]);
});

export const commit = withError(async function commit(message: string) {
  await exec('git', ['commit', '--no-verify', '-m', decorateMessage(message)]);
});

export const push = withError(async function push(branch: string) {
  await exec('git', ['push', 'origin', branch]);
});
