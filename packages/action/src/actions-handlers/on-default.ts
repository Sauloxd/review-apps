import * as io from '@actions/io';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as manifest from '../utils/manifest';
import { retry } from '../utils/retry';
import * as git from '../utils/git';
import * as fileManager from '../utils/file-manager';
import { userInput } from '../utils/user-input';
import { SanitizedPayloadParams } from '../interface';

export async function onDefault(params: SanitizedPayloadParams) {
  const input = userInput();
  const paths = fileManager.paths(params);

  core.info(`
    -> Paths:
    -> Your app will be hosted in github pages:
    -> "https://{ username }.github.io/{ repository }/{ slug }/{ branch }/{ head_commit }"
    -> This app URL:
    -> @TODO

    -> Example:
    -> "https://sauloxd.github.io/review-apps/storybook/feature-1/c1fcf15"

    -> We'll build your app with the proper PUBLIC_URL
    -> For more info:
    -> https://github.com/facebook/create-react-app/pull/937/files#diff-9b26877ecf8d15b7987c96e5a17502f6
    -> https://www.gatsbyjs.com/docs/path-prefix/
  `);

  core.info(`
    -> Building app
  `);

  core.exportVariable('PUBLIC_URL', `/${paths.byRepo}/${paths.byHeadCommit}`);
  await exec(input.buildCmd);

  core.info(`
    -> Current working branch: ${params.branch.name}"
    -> Will move (and override) the build result on '${input.dist}' to '${paths.byHeadCommit}' in ${input.branch}"
  `);

  git.stageChanges(input.dist);
  git.commit(`Persisting dist output for ${input.slug}`);

  await retry(5)(async () => {
    git.hardReset(input.branch);
    git.getFilesFromOtherBranch(params.branch.name, input.dist);
    manifest.replaceApp(params);

    await exec('git', ['status']);
    core.debug('Coping from input.dist to -> ' + paths.byHeadCommit);
    await io.cp(input.dist, paths.byHeadCommit, {
      recursive: true,
      force: true,
    });
    await exec('git', ['status']);

    git.stageChanges(
        paths.byHeadCommit,
        'index.html',
        'manifest.json',
    );
    git.commit(`Updating app ${params.branch.headCommit}`);
    git.push(params.branch.name);
  });
  core.debug('Return to original state');
  git.hardReset(params.branch.name);
}
