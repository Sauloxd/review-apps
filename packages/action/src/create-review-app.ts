import * as github from '@actions/github';
import { getInput, info } from '@actions/core';
import { exec } from '@actions/exec';
import { onPrClose } from './on-pr-close';
import { getParamsFromPayload } from './utils/params-from-payload';
import { otherEvents } from './other-events';

export async function createReviewApp() {
  const distDir = getInput('dist');
  const slug = getInput('slug');
  const ghBranch = getInput('branch');
  const buildCmd = getInput('build-cmd');
  const {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    pullRequestUrl,
    isClosePrEvent,
  } = getParamsFromPayload(github.context.payload);
  info('Review Apps');
  info(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', 'true']);
  const commitMessage = `[skip ci] ref to ${headCommitId} for - ${slug}`;
  const pathByRepo = repositoryName;
  const pathByBranch = `${slug}/${branchName}`;
  const pathByHeadCommit = `${pathByBranch}/${headCommitId.substr(0, 6)}`;

  if (isClosePrEvent) {
    await onPrClose({
      branchName,
      commitMessage,
      ghBranch,
      pathByBranch,
      pathByHeadCommit,
      slug,
    });
  } else {
    await otherEvents({
      branchName,
      buildCmd,
      commitMessage,
      distDir,
      ghBranch,
      headCommitId,
      pathByHeadCommit,
      pathByRepo,
      pullRequestUrl,
      slug,
    });
  }
}
