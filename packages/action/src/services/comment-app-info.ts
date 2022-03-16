import { info } from '@actions/core';
import * as github from '@actions/github';
import { withError } from '../utils/log-error';
import { userInput } from '../utils/user-input';
import * as manifest from '../utils/manifest';
import { App, SanitizedPayloadParams } from '../interface';

const REVIEW_APP_ID = '# Review Apps';

export const commentAppInfo = withError(async function commentAppInfo(
  params: SanitizedPayloadParams
) {
  const { githubToken } = userInput();
  if (!githubToken) {
    info(
      `   -> No GITHUB_TOKEN provided! Can't manage comments for this action`
    );

    return;
  }

  const commentApi = CommentApi();
  const comments = await commentApi.getReviewAppComments();
  const comment = comments[0];

  if (comments.length > 1) {
    info('   -> More than 1 comment found!');
    info(
      '    -> We manage the comment based on the presence of "# Review Apps" string'
    );
    info('    -> Removing comments');
    await Promise.all(comments.slice(1).map((c) => commentApi.delete(c.id)));
  }

  const body = getCommentBody(params.branch.name);

  if (!comment) {
    info('    -> Creating comment with Review Apps details');
    await commentApi.create(body);
  } else {
    info('    -> Comment found! Updating it with new info...');
    await commentApi.update(comment.id, body);
  }
});

const getCommentBody = (branch: string) => {
  const pathsForBranch = manifest.getBranchPaths(branch);
  const body = `
  ${REVIEW_APP_ID}
  ## URLS
${pathsForBranch.apps.map(formatToListedLink).join('')}
  ### Last updated at
  ${new Date().toString()}
 `;

  return body;

  function formatToListedLink(app: App) {
    return `  - [${app.name}](${encodeURI(app.githubPagesUrl)})\n`;
  }
};
const CommentApi = () => {
  const { githubToken } = userInput();
  const octokit = github.getOctokit(githubToken);
  const context = github.context;
  const pullRequestNumber = context.payload.pull_request?.number as number;
  const commentApi = {
    create(body: string) {
      return octokit.rest.issues.createComment({
        ...context.repo,
        // eslint-disable-next-line
        issue_number: pullRequestNumber,
        body,
      });
    },
    async getReviewAppComments() {
      const response = await octokit.rest.issues.listComments({
        ...context.repo,
        // eslint-disable-next-line
        issue_number: pullRequestNumber,
      });

      return response.data.filter((d) => d.body?.includes(REVIEW_APP_ID));
    },
    delete(id: number) {
      return octokit.rest.issues.deleteComment({
        ...context.repo,
        // eslint-disable-next-line
        comment_id: id,
      });
    },
    update(id: number, body: string) {
      return octokit.rest.issues.updateComment({
        ...context.repo,
        // eslint-disable-next-line
        comment_id: id,
        body,
      });
    },
  };

  return commentApi;
};
