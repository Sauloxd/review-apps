import * as fs from 'fs';
import * as core from '@actions/core';

export function getManifest() {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    core.debug('Failed to get manifest');
    manifest = {};
  }

  return manifest;
}

export function removeApp({ manifest, branchName, slug }) {
  let newManifest = JSON.parse(JSON.stringify(manifest));
  const apps = (
    (newManifest[branchName] && newManifest[branchName].apps) ||
    []
  ).filter((app) => app.name !== slug);
  if (apps.length === 0) {
    newManifest = Object.keys(newManifest).reduce((acc, key) => {
      if (key === branchName) return acc;

      return { ...acc, [key]: newManifest[key] };
    }, {});
  } else {
    newManifest[branchName] = {
      ...newManifest[branchName],
      apps,
    };
  }

  return newManifest;
}

export function replaceApp({
  manifest,
  branchName,
  slug,
  headCommitId,
  pathByHeadCommit,
  pullRequestUrl,
}) {
  const newManifest = JSON.parse(JSON.stringify(manifest));
  const apps = (
    (newManifest[branchName] && newManifest[branchName].apps) ||
    []
  ).filter((app) => app.name !== slug);
  newManifest[branchName] = {
    ...newManifest[branchName],
    apps: apps.concat({
      name: slug,
      headCommitId,
      updatedAt: new Date(),
      href: pathByHeadCommit,
      pullRequestUrl,
    }),
  };

  return newManifest;
}
