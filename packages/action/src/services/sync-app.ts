import * as core from '@actions/core';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import { SanitizedPayloadParams } from '../interface';
import * as fileManager from '../utils/file-manager';
import * as git from '../utils/git';
import * as manifest from '../utils/manifest';
import { retry } from '../utils/retry';
import { withError } from '../utils/log-error';
import { userInput } from '../utils/user-input';

export const syncApp = withError(async function syncApp(
  params: SanitizedPayloadParams
) {
  const input = userInput();
  const paths = fileManager.paths(params);

  core.info(`
    -> Your app will be hosted in github pages:
    -> "https://${params.repository.owner}.github.io/${params.repository.name}"

    -> This app is served from:
    -> "https://${params.repository.owner}.github.io/${params.repository.name}/${paths.byHeadCommit}"

  `);

  await optionalBuildApp(params);

  core.info(`
    -> Current working branch: ${params.branch.name}"
    -> Will move (and override) the build result on '${input.dist}' to '${paths.byHeadCommit}' in ${input.branch}"
  `);

  await git.stageChanges(input.dist);
  await git.commit(`Persisting dist output for ${input.slug}`);

  await retry(5)(updateApp.bind(null, params));

  core.debug('Return to original state');

  await git.hardReset(params.branch.name);
});

async function updateApp(params: SanitizedPayloadParams) {
  const input = userInput();
  const paths = fileManager.paths(params);
  await git.hardReset(input.branch);
  await git.getFilesFromOtherBranch(params.branch.name, input.dist);
  manifest.replaceApp(params);

  core.debug('Copying from input.dist to -> ' + paths.byHeadCommit);
  core.debug(input.dist + '->' + paths.byHeadCommit);
  await io.cp(input.dist, paths.byHeadCommit, {
    recursive: true,
    force: true,
  });
  core.debug('Finished copying');

  await git.stageChanges(paths.byHeadCommit, 'index.html', 'manifest.json');
  await git.commit(`Updating app ${paths.byHeadCommit}`);
  await git.push(input.branch);
}

async function optionalBuildApp(params: SanitizedPayloadParams) {
  const input = userInput();

  if (!input.buildCmd) {
    core.info('-> NO "buildCmd" passed, skipping build phase');

    return;
  }
  const paths = fileManager.paths(params);
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

  await exec(input.buildCmd);
}
