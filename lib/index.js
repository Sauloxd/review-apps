const fs = require('fs');
const io = require('@actions/io');
const core = require('@actions/core');
const github = require('@actions/github');
const htmlTemplate = require('./template/html-template');
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
  const payload = github.context.payload;
  const userName = payload.pusher.name;
  const userEmail = payload.pusher.email;
  const headCommitId = payload.head_commit.id;

  core.debug(`Setting config options - name:${userName}, email:${userEmail}`);
  await exec('git', ['config', '--global', 'user.name', userName]);
  await exec('git', ['config', '--global', 'user.email', userEmail]);
  await exec('git', ['config', 'pull.rebase', true]);
  const branchName = await exec('echo', ['$GITHUB_REF']);
  const fullPathDir = `${outputDir}/${branchName}`;
  const commitMessage = `[skip ci] ref to ${headCommitId}`;
  console.log('BRANCH NAME-->', branchName);
  console.log('BRANCH NAME-->', branchName.length);

  core.debug(`
    -> Current working branch: ${branchName}"
    -> Will move (and override) the build result on '${publicAssetsDir}' to '${fullPathDir}' in ${ghPagesSourceBranch}"
    -> Finally, will commit and push with the following message:"
    -> ${commitMessage}"
  `);

  console.log('---> ', process.cwd());
  await exec('mv', [outputDir, '.tmp']);
  await exec('git', ['fetch']);
  await exec('git', ['checkout', ghPagesSourceBranch]);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  fs.rmdirSync(fullPathDir, { recursive: true });
  await exec('mv', ['.tmp', fullPathDir]);
  const gitStatus = await exec('git', 'status');
  console.log('---------');
  console.log(gitStatus);
  console.log('=========');

  // await exec(`
  //   git status | grep "$FULL_PATH_DIR" && \
  //     echo " -> Changes detected in new build" && \
  //     git add "$FULL_PATH_DIR" && \
  //     git commit -m "$COMMIT_MESSAGE" || \
  //     echo "No changes on $FULL_PATH_DIR to commit! Moving on"

  //   echo "Trying to push new changes to $STATIC_APP_BRANCH"
  //   COUNTER=0
  //   function retry() {
  //     echo "Retrying... count: $COUNTER"
  //     git pull origin $STATIC_APP_BRANCH
  //     git push origin $STATIC_APP_BRANCH
  //     if [ $? -ne 0 ]; then
  //       if [ $COUNTER -lt 5 ]; then
  //         ((COUNTER=COUNTER+1))
  //         retry
  //       fi
  //     fi
  //   }
  //   retry
  // `).then(() => {
  //   console.log('Succefully set things up', __dirname);
  //   console.log(fs.readdirSync(path.join(__dirname, './')));
  // });
}
