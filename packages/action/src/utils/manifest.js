const fs = require('fs');
const core = require('@actions/core');

module.exports = {
  getManifest,
  removeApp,
  replaceApp
};

function getManifest() {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    core.debug(e);
    manifest = {};
  }

  return manifest;
}

function removeApp({ manifest, branchName, slug }) {
  let newManifest = { ...manifest };
  const apps = (newManifest[branchName] && newManifest[branchName].apps || []).filter(app => app.name !== slug);
  if (apps.length === 0) {
    newManifest = Object.keys(newManifest).reduce((acc, key) => {
      if (key === branchName) return acc;
      return { ...acc, [key]: newManifest[key] };
    }, {});
  } else {
    newManifest[branchName] = {
      ...newManifest[branchName],
      apps
    };
  }

  return newManifest;
}

function replaceApp({
  manifest,
  branchName,
  slug,
  headCommitId,
  pathByHeadCommit,
  pullRequestUrl
}) {
  const newManifest = { ...manifest };

  const apps = (newManifest[branchName] && newManifest[branchName].apps || []).filter(app => app.name !== slug);
  newManifest[branchName] = {
    ...newManifest[branchName],
    apps: apps.concat({
      name: slug,
      headCommitId,
      updatedAt: new Date(),
      href: pathByHeadCommit,
      pullRequestUrl
    })
  };

  return newManifest;
}
