import { debug, setFailed } from '@actions/core';
import { WebhookPayload } from '@actions/github/lib/interfaces';
import {
  PullRequestAction,
  SanitizedPayloadParams,
  GithubPullRequestPayload,
} from '../interface';

export function getParamsFromPayload(
  payload: WebhookPayload & GithubPullRequestPayload
): SanitizedPayloadParams {
  debug('CALL getParamsFromPayload');
  debug('WITH payload');
  debug(JSON.stringify(payload, null, 2));

  switch (payload.action) {
    case PullRequestAction.OPENED:
    case PullRequestAction.CLOSED:
    case PullRequestAction.SYNCHRONIZE:
    case PullRequestAction.LABELED:
      return {
        action: payload.action,
        user: {
          name: payload.sender?.name,
          email: payload.sender?.email,
        },
        repository: {
          name: payload.repository.name,
        },
        branch: {
          name: payload.pull_request.head.ref.split('/').pop() as string,
          headCommit: payload.pull_request.head.sha,
          pullRequest: {
            url: payload.pull_request.html_url,
          },
        },
      };
    case PullRequestAction.PUSH:
      return {
        action: payload.action,
        user: {
          name: payload.pusher.name,
          email: payload.pusher.email,
        },
        repository: {
          name: payload.repository.name,
        },
        branch: {
          name: payload.ref.split('/').pop(),
          headCommit: payload.head_commit.id,
          pullRequest: {
            url: undefined,
          },
        },
      };
    default:
      setFailed(`unhandled payload action: ${payload.action}`);
      throw new Error(`unhandled payload action: ${payload.action}`);
  }
}
