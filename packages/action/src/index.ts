import * as github from '@actions/github';
import { setFailed, debug, info } from '@actions/core';
import * as handlers from './event-handlers';
import { GithubTriggerActions } from './interface';
import { withError } from './utils/log-error';
import * as git from './utils/git';
import { userInput } from './utils/user-input';

export const run = withError(async function run() {
  // debug(JSON.stringify(github, null, 2));
  const event = github.context.eventName as GithubTriggerActions;
  const input = userInput();

  info('-> Review Apps start!');
  info('-> Your input: ');
  info(`-> ${JSON.stringify(input, null, 2)}`);

  await git.configure({
    name: 'ReviewApps admin',
    email: 'review-apps@saulo.dev',
  });

  switch (event) {
    case GithubTriggerActions.PULL_REQUEST:
      return await handlers.onPullRequest();
    case GithubTriggerActions.PUSH:
      return await handlers.onPush();
    default:
      debug(JSON.stringify(github.context, null, 2));
      setFailed(`-> Invalid trigger for this workflow: ${event}`);
      throw new Error(`-> Invalid trigger for this workflow: ${event}`);
  }
});

run();
