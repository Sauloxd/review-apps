import * as core from '@actions/core';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import { SanitizedPayloadParams, UserInput } from '../interface';
import * as fileManager from '../utils/file-manager';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
import { retry } from '../utils/retry';
import { withError } from '../utils/log-error';
import { commentAppInfo } from './comment-app-info';
import { userInput } from '../utils/user-input';

export const syncApps = withError(async function syncApps(
  params: SanitizedPayloadParams
) {
  core.info(`
    -> Your apps will be hosted in github pages:
    -> "https://${params.repository.owner}.github.io/${params.repository.name}"
  `);

  await git.hardReset(params.branch.name);

  for (const app of userInput().apps) {
    await syncApp(params, app);
  }

  core.debug('Return to original state');

  await git.hardReset(params.branch.name);
});

const syncApp = withError(async function syncApp(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
) {
  await optionalBuildApp(params, app);
  const paths = fileManager.paths(params, app);

  core.debug(`
    -> Current working branch: ${params.branch.name}"
    -> Will move (and override) the build result on '${app.dist}' to '${
    paths.byHeadCommit
  }' in ${userInput().ghPagesBranch}"
  `);
  await retry(5)(updateApp.bind(null, params, app));
});

async function updateApp(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
) {
  const paths = fileManager.paths(params, app);
  await git.hardReset(userInput().ghPagesBranch);
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
    !userInput().skipIndexHtml && 'index.html',
    'manifest.json',
  ]);
  await git.commit(`Updating app ${paths.byHeadCommit}`);
  await git.push(userInput().ghPagesBranch);
  await commentAppInfo(params);
}

const optionalBuildApp = withError(async function optionalBuildApp(
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
    -> BUILDING APP: ${app.slug}

    -> We'll build your app with the proper PUBLIC_URL: ${PUBLIC_URL}
    -> That way you can use relative links inside your app.
    -> For more info:
    -> https://github.com/facebook/create-react-app/pull/937/files#diff-9b26877ecf8d15b7987c96e5a17502f6
    -> https://www.gatsbyjs.com/docs/path-prefix/
  `);

  await withError(exec)(app.build);
  await git.stageChanges([app.dist]);
  await git.commit(`Persisting dist output for ${app.slug}`);
});
