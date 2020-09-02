const fs = require('fs');
const core = require('@actions/core');

module.exports = {
  getManifest
};

function getManifest () {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    core.debug(e);
    manifest = {};
  }

  return manifest;
}
