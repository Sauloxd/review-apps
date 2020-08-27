const fs = require('fs');
const io = require('@actions/io');
const core = require('@actions/core');
const github = require('@actions/github');
const indexPage = require('./template/html-template');
const { exec } = require('@actions/exec');

try {
  stories();
} catch (error) {
  core.setFailed(error.message);
}

async function stories() {
  const publicAssetsDir = core.getInput('public-assets-dir');
  const outputDir = core.getInput('output-dir');
  const ghPagesSourceBranch = core.getInput('gh-pages-source-branch');
  const {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName
  } = getParamsFromPayload();

  core.debug(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', true]);
  const fullPathDir = `${outputDir}/${branchName}`;
  const commitMessage = `[skip ci] ref to ${headCommitId}`;

  core.debug(`
    -> Current working branch: ${branchName}"
    -> Will move (and override) the build result on '${publicAssetsDir}' to '${fullPathDir}' in ${ghPagesSourceBranch}"
    -> Finally, will commit and push with the following message:"
    -> ${commitMessage}"
  `);

  console.log('---> ', process.cwd());
  await exec('mv', [publicAssetsDir, '.tmp']);
  await exec('git', ['fetch']);
  await exec('git', ['checkout', ghPagesSourceBranch]);
  await io.cp('.tmp/.', fullPathDir, { recursive: true, force: true });

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
  } catch (e) {
    manifest = {};
  }

  const apps = (manifest[outputDir] && manifest[outputDir].apps || []).filter(app => app.name !== branchName);
  manifest[outputDir] = {
    ...manifest[outputDir],
    apps: apps.concat({
      name: branchName,
      headCommitId,
      updatedAt: new Date(),
      href: `/${repositoryName || 'saulo.dev'}/${outputDir}/${branchName}`,
      pullRequest: ''
    })
  };

  console.log(JSON.stringify(manifest, null, 2));

  fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync('index.html', indexPage(manifest), 'utf-8');
  fs.writeFileSync('debug.json', JSON.stringify(github, null, 2), 'utf-8');

  try {
    console.log('tentando funcionar');
    await exec('git', ['add', fullPathDir, 'index.html', 'manifest.json']);
    await exec('git', ['commit', '-m', commitMessage]);
  } catch (e) {
    console.log('Ignoring errors', e);
  }

  await retry5(async () => {
    await exec('git', ['pull', 'origin', ghPagesSourceBranch]);
    await exec('git', ['push', 'origin', ghPagesSourceBranch]);
  });

}

const retry5 = retryGen(5);

function retryGen(times) {
  return async function retry(cb, count = 0) {
    try {
      await cb();
    } catch (e) {
      if (count < times) {
        console.log('Retrying... ', count);
        await retry(cb, count + 1);
      } else {
        console.log('Exausted retryies: ', count);
      }
    }
  };
}

function getParamsFromPayload() {
  const payload = github.context.payload;
  let userName;
  let userEmail;
  let headCommitId;
  let branchName;
  let repositoryName;

  if (payload.action === 'synchronize') {
    userName = payload.sender && payload.sender.name;
    userEmail = payload.sender && payload.sender.email;
    headCommitId = payload.head.sha;
    branchName = payload.ref.split('/').pop();
    repositoryName = payload.repository.name;
  }

  if (payload.action === 'push') {
    userName = payload.pusher.name;
    userEmail = payload.pusher.email;
    headCommitId = payload.head_commit.id;
    branchName = payload.ref.split('/').pop();
    repositoryName = payload.repository.name;
  }

  return {
    userName,
    userEmail,
    headCommitId,
    branchName,
    repositoryName
  };
}
