const github = require('@actions/github');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const onPrClose = require('./on-pr-close');
const getParamsFromPayload = require('./utils/params-from-payload');
const otherEvents = require('./other-events');

module.exports = {
  createReviewApp
};

async function createReviewApp() {
  const distDir = core.getInput('dist');
  const slug = core.getInput('slug');
  const ghBranch = core.getInput('branch');
  const buildCmd = core.getInput('build-cmd');
  const {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    pullRequestUrl,
    isClosePrEvent
  } = getParamsFromPayload(github.context.payload);

  core.debug(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', true]);
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
      slug
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
      slug
    });
  }

}
