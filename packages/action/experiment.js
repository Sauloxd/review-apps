const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const message = core.getInput('message');
    const github_token = core.getInput('GITHUB_TOKEN');
    const context = github.context;
    if (context.payload.pull_request == null) {
      core.setFailed('No pull request found.');

      return;
    }
    const PR = context.payload.pull_request.number;
    const octokit = new github.GitHub(github_token);
    const newComment = octokit.issues.createComment({
      ...context.repo,
      issue_number: PR,
      body: message,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}
