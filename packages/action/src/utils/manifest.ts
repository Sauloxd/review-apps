import * as fs from 'fs';
import * as core from '@actions/core';
import { App, Manifest, SanitizedPayloadParams } from '../interface';
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
  params: SanitizedPayloadParams
) {
  const manifest = getManifest();
  const input = userInput();
  const apps = manifest[params.branch.name]?.apps || [];
  const index = apps.findIndex((app) => app.name === input.slug);
  const newApp = buildApp(params);

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

export function githubPagesUrl(params: SanitizedPayloadParams) {
  const paths = fileManager.paths(params);

  return `https://${params.repository.owner}.github.io/${params.repository.name}/${paths.byHeadCommit}`;
}

function syncManifest(manifest: Manifest) {
  const input = userInput();
  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  if (!input.skipIndexHtml) {
    fs.writeFileSync('index.html', defaultPage(manifest), 'utf-8');
  }
}

function buildApp(params: SanitizedPayloadParams): App {
  const input = userInput();
  const paths = fileManager.paths(params);

  return {
    name: input.slug,
    headCommitId: params.branch.headCommit,
    updatedAt: new Date(),
    href: paths.byHeadCommit,
    pullRequestUrl: params.branch.pullRequest.url,
    githubPagesUrl: githubPagesUrl(params),
  };
}

function getManifest(): Manifest {
  core.debug(
    'You can only get manifest if you are in github actions page branch!'
  );
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  core.debug('CALL getManifest');
  core.debug(JSON.stringify(manifest, null, 2));

  return manifest;
}
