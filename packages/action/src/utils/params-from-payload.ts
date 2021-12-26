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

  const baseParams = {
    action: payload.action as PullRequestAction,
    user: {
      name: 'ReviewApps admin',
      email: 'review-apps@saulo.dev',
    },
    repository: {
      name: payload.repository.name,
      owner: payload.repository.owner.login,
    },
  };

  switch (payload.action) {
    case PullRequestAction.OPENED:
    case PullRequestAction.CLOSED:
    case PullRequestAction.SYNCHRONIZE:
    case PullRequestAction.LABELED:
      return {
        ...baseParams,
        branch: {
          name: payload.pull_request.head.ref,
          headCommit: payload.pull_request.head.sha,
          pullRequest: {
            url: payload.pull_request.html_url,
          },
        },
      };
    case PullRequestAction.PUSH:
      return {
        ...baseParams,
        branch: {
          name: payload.ref,
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
