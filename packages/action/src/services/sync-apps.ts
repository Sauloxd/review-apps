import * as core from '@actions/core';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import { SanitizedPayloadParams, UserInput } from '../interface';
import * as fileManager from '../utils/file-manager';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
import { retry } from '../utils/retry';
import { withError } from '../utils/log-error';
import { userInput } from '../utils/user-input';
import { commentAppInfo } from './comment-app-info';

export const syncApps = withError(async function syncApps(
  params: SanitizedPayloadParams,
  userInput: UserInput
) {
  core.info(`
    -> Your apps will be hosted in github pages:
    -> "https://${params.repository.owner}.github.io/${params.repository.name}"
  `);

  Promise.all(userInput.apps.map((app) => syncApp(params, app, userInput)));
});

const syncApp = async (
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number],
  userInput: UserInput
) => {
  await optionalBuildApp(params, app);
  const paths = fileManager.paths(params, app);

  core.debug(`
    -> Current working branch: ${params.branch.name}"
    -> Will move (and override) the build result on '${app.dist}' to '${paths.byHeadCommit}' in ${userInput.ghPagesBranch}"
  `);

  await git.stageChanges([app.dist]);
  await git.commit(`Persisting dist output for ${app.slug}`);

  await retry(5)(updateApp.bind(null, params, app));

  core.debug('Return to original state');

  await git.hardReset(params.branch.name);
};

async function updateApp(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
) {
  const input = userInput();
  const paths = fileManager.paths(params, app);
  await git.hardReset(input.ghPagesBranch);
  await git.getFilesFromOtherBranch(params.branch.name, app.dist);
  manifest.replaceApp(params, app);

  core.debug('Copying from input.dist to -> ' + paths.byHeadCommit);
  core.debug(app.dist + '->' + paths.byHeadCommit);
  await io.cp(app.dist, paths.byHeadCommit, {
    recursive: true,
    force: true,
  });
  core.debug('Finished copying');

  await git.stageChanges([
    paths.byHeadCommit,
    !input.skipIndexHtml && 'index.html',
    'manifest.json',
  ]);
  await git.commit(`Updating app ${paths.byHeadCommit}`);
  await git.push(input.ghPagesBranch);
  await commentAppInfo(params);
}

async function optionalBuildApp(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
) {
  if (!app.build) {
    core.info(`
    -> NO "buildCmd" passed, skipping build phase
    `);

    return;
  }
  const paths = fileManager.paths(params, app);
  const PUBLIC_URL = `/${paths.byRepo}/${paths.byHeadCommit}`;

  core.info(`
    -> BUILDING APP

    -> We'll build your app with the proper PUBLIC_URL: ${PUBLIC_URL}
    -> That way you can use relative links inside your app.
    -> For more info:
    -> https://github.com/facebook/create-react-app/pull/937/files#diff-9b26877ecf8d15b7987c96e5a17502f6
    -> https://www.gatsbyjs.com/docs/path-prefix/
  `);

  await git.hardReset(params.branch.name);

  core.exportVariable('PUBLIC_URL', PUBLIC_URL);

  await exec(app.build);
}
