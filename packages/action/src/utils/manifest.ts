import * as fs from 'fs';
import * as core from '@actions/core';
import { App, Manifest, SanitizedPayloadParams } from '../interface';
import { indexPage } from '../template/index-page';
import * as fileManager from './file-manager';
import { userInput } from './user-input';

export function removeApp(branch: string) {
  core.debug('CALL removeApp');
  core.debug(`WITH branch ${branch}`);
  const manifest = getManifest();

  delete manifest[branch];

  core.debug(JSON.stringify(manifest, null, 2));

  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');
}

export function getManifest(): Manifest {
  try {
    return JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    core.setFailed('Failed to get manifest');
    throw new Error('Failed to get manifest');
  }
}

export function replaceApp(params: SanitizedPayloadParams) {
  core.debug('CALL replaceApp');
  core.debug(`WITH branch ${params.branch.name}`);
  const manifest = getManifest();
  const input = userInput();
  const apps = manifest[params.branch.name]?.apps || [];
  const index = apps.findIndex((app) => app.name === input.slug);
  const newApp = buildApp(params);

  if (index > 0) {
    apps[index] = newApp;
  } else {
    apps.push(newApp);
  }

  manifest[params.branch.name] = {
    ...manifest[params.branch.name],
    apps,
  };

  core.debug(JSON.stringify(manifest, null, 2));
  core.debug('Saving manifest.json');
  fs.writeFileSync(
    'manifest.json',
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  core.debug('Saving index.html');
  fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');

  return manifest;
}

function buildApp(params: SanitizedPayloadParams): App {
  const input = userInput();
  const paths = fileManager.paths(params);

  return {
    name: input.slug,
    headCommit: params.branch.headCommit,
    updatedAt: new Date(),
    href: paths.byHeadCommit,
    pullRequestUrl: params.branch.pullRequest.url,
  };
}
