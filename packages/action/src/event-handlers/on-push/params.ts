import * as github from '@actions/github';
import { GithubPushPayload } from '../../../spec/fixtures/on-push-github';
import { SanitizedPayloadParams } from '../../interface';

export function getParams(): SanitizedPayloadParams {
  const payload: GithubPushPayload = github.context.payload as any;

  return {
    repository: {
      name: payload.repository.name,
      owner: payload.repository.owner.login,
    },
    branch: {
      name: payload.ref,
      headCommit: payload.head_commit.id,
      pullRequest: {
        url: undefined,
      },
    },
  };
}
