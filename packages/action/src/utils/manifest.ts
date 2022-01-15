import * as fs from 'fs';
import * as core from '@actions/core';
import { App, Manifest, SanitizedPayloadParams, UserInput } from '../interface';
import { defaultPage } from '../template/default';
import * as fileManager from './file-manager';
import { userInput } from './user-input';
import { withError } from './log-error';

// Due to poorly designed API,
// All functions here that depends on `getManifest()`
// will break if operations are called outside "github pages" branch!

export const removeApp = withError(async function removeApp(branch: string) {
  const manifest = getManifest();

  delete manifest[branch];

  syncManifest(manifest);
});

export const replaceApp = withError(async function replaceApp(
  params: SanitizedPayloadParams,
  appInput: UserInput['apps'][number]
) {
  const manifest = getManifest();
  const apps = manifest[params.branch.name]?.apps || [];
  const index = apps.findIndex((app) => app.name === appInput.slug);
  const newApp = buildApp(params, appInput);

  if (index > -1) {
    apps[index] = newApp;
  } else {
    apps.push(newApp);
  }

  manifest[params.branch.name] = {
    ...manifest[params.branch.name],
    apps,
  };

  syncManifest(manifest);
});

export function getBranchPaths(branch: string) {
  const manifest = getManifest();

  return manifest[branch];
}

export function githubPagesUrl(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
) {
  const paths = fileManager.paths(params, app);

  return `https://${params.repository.owner}.github.io/${params.repository.name}/${paths.byHeadCommit}`;
}

function syncManifest(manifest: Manifest) {
  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  if (!userInput().skipIndexHtml) {
    core.debug('Creating index.html');
    fs.writeFileSync('index.html', defaultPage(manifest), 'utf-8');
  } else {
    core.debug('Skipping index.html');
  }
}

function buildApp(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
): App {
  const paths = fileManager.paths(params, app);

  return {
    name: app.slug,
    headCommitId: params.branch.headCommit,
    updatedAt: new Date(),
    href: paths.byHeadCommit,
    pullRequestUrl: params.branch.pullRequest.url,
    githubPagesUrl: githubPagesUrl(params, app),
  };
}

function getManifest(): Manifest {
  core.debug('CALL getManifest');
  core.debug(
    'You can only get manifest if you are in github actions page branch!'
  );
  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    core.debug(JSON.stringify(manifest, null, 2));
  }

  return manifest;
}
