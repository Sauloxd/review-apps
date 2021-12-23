import * as github from '@actions/github';
import { info } from '@actions/core';
import * as handlers from './actions-handlers';
import * as git from './utils/git';
import { getParamsFromPayload } from './utils/params-from-payload';
import { GithubPullRequestPayload, PullRequestAction } from './interface';
import { WebhookPayload } from '@actions/github/lib/interfaces';

export async function createReviewApp() {
  const payload = github.context.payload as unknown as WebhookPayload &
    GithubPullRequestPayload;
  const sanitizedParams = getParamsFromPayload(payload);

  info('Review Apps start!');

  await git.configure(sanitizedParams);

  switch (payload.action) {
    case PullRequestAction.CLOSED:
      return handlers.onClosed(sanitizedParams);
    default:
      return handlers.onDefault(sanitizedParams);
  }
}
