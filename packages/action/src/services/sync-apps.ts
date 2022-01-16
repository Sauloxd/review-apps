import * as core from '@actions/core';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import { SanitizedPayloadParams, UserInput } from '../interface';
import * as fileManager from '../utils/file-manager';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
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
    const paths = fileManager.paths(params, app);
    await optionalBuildApp(params, app);
    core.debug(`
      -> Current working branch: ${params.branch.name}"
      -> Will move (and override) the build result on '${app.dist}' to '${
      paths.byHeadCommit
    }' in ${userInput().ghPagesBranch}"
    `);
  }

  await git.hardReset(userInput().ghPagesBranch);

  for (const app of userInput().apps) {
    const paths = fileManager.paths(params, app);

    manifest.replaceApp(params, app);

    const tmpDir = userInput().tmpDir + '/' + paths.byHeadCommit;

    await io.cp(tmpDir, paths.byHeadCommit, {
      recursive: true,
      force: true,
    });
    await git.stageChanges([paths.byHeadCommit]);
    core.debug('Finished copying');
  }

  await git.stageChanges([
    !userInput().skipIndexHtml && 'index.html',
    'manifest.json',
  ]);
  await git.commit(`Updating branch ${params.branch.name}`);
  await git.push(userInput().ghPagesBranch);
  await commentAppInfo(params);

  core.debug('Return to original state');

  await git.hardReset(params.branch.name);
});

const optionalBuildApp = withError(async function optionalBuildApp(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
) {
  const paths = fileManager.paths(params, app);

  if (app.build) {
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
  } else {
    core.info(`
    -> NO "buildCmd" passed, skipping build phase
    `);
  }

  const tmpDir = userInput().tmpDir + '/' + paths.byHeadCommit;

  core.info('-> Copying from input.dist to -> ' + paths.byHeadCommit);

  await io.cp(app.dist, tmpDir, {
    recursive: true,
    force: true,
  });
});
