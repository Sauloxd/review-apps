import * as github from '@actions/github';
import { GithubPullRequestPayload } from '../../../spec/fixtures/on-pull-request';
import { PullRequestAction, SanitizedPayloadParams } from '../../interface';

export function getParams(): SanitizedPayloadParams {
  const payload: GithubPullRequestPayload = github.context.payload as any;

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
