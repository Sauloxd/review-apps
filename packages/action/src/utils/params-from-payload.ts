import * as core from '@actions/core';

export function getParamsFromPayload(payload) {
  let userName = 'review-app-action-user';
  let userEmail = 'review-app-action-email';
  let headCommitId;
  let branchName;
  let repositoryName;
  let pullRequestUrl;

  try {
    if (['opened', 'closed', 'synchronize', 'labeled'].includes(payload.action)) {
      userName = payload.sender && payload.sender.name || userName;
      userEmail = payload.sender && payload.sender.email || userEmail;
      headCommitId = payload.pull_request.head.sha;
      branchName = payload.pull_request.head.ref.split('/').pop();
      repositoryName = payload.repository.name;
      pullRequestUrl = payload.pull_request.html_url;
    }
    if (['push'].includes(payload.action) || typeof payload.action === 'undefined' ) {
      userName = payload.pusher.name || userName;
      userEmail = payload.pusher.email || userEmail;
      headCommitId = payload.head_commit.id;
      branchName = payload.ref.split('/').pop();
      repositoryName = payload.repository.name;
      pullRequestUrl = undefined;
    }
  } catch (e) {
    core.debug(e);
    core.debug(JSON.stringify(payload, null, 2));
    throw new Error('Failed to get basic parameters');
  }

  core.debug(`-> received payload.action ${payload.action}`);

  const result = {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName,
    isClosePrEvent: payload.action === 'closed',
    ...(pullRequestUrl?{ pullRequestUrl }:{}),
    ...(payload.action?{ action: payload.action }:{})
  };

  if (Object.values(result).filter(r => typeof r === 'undefined').length !== 0) {
    core.debug('-> A value is undefined');
    core.debug(JSON.stringify(payload, null, 2));
  }

  core.debug('-> Metadata:');
  core.debug(JSON.stringify(result, null, 2));

  return result;
}
