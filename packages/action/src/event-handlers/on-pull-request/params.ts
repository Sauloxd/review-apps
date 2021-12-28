import * as github from '@actions/github';
import { PullRequestAction, SanitizedPayloadParams } from '../../interface';

export function getParams(): SanitizedPayloadParams {
  const payload = github.context.payload as any;

  return {
    action: payload.action as PullRequestAction,
    repository: {
      name: payload.repository.name,
      owner: payload.repository.owner.login,
    },
    branch: {
      name: payload.pull_request.head.ref,
      headCommit: payload.pull_request.head.sha,
      pullRequest: {
        url: payload.pull_request.html_url,
      },
    },
  };
}
