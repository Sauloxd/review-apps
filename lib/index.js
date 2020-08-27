const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('./utils/exec');

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

  await exec(`
    NAME=${userName}
    EMAIL=${userEmail}
    echo "Configuring git config name: $NAME, email: $EMAIL"
    git config --global user.name $NAME
    git config --global user.email $EMAIL
    git config pull.rebase true

    BRANCH_NAME=$(echo $GITHUB_REF | awk 'BEGIN { FS = "/" } ; { print $3 }')
    DIST_DIR=${publicAssetsDir}
    OUTPUT_ROOT_DIR=${outputDir}
    FULL_PATH_DIR="$OUTPUT_ROOT_DIR/$BRANCH_NAME"
    STATIC_APP_BRANCH=${ghPagesSourceBranch}
    HEAD_COMMIT_ID=${headCommitId}
    COMMIT_MESSAGE="[skip ci] ref to $HEAD_COMMIT_ID"

    echo " -> Current working branch: $BRANCH_NAME"
    echo " -> Will move (and override) the build result on '$DIST_DIR' to '$FULL_PATH_DIR' in $STATIC_APP_BRANCH"
    echo " -> Finally, will commit and push with the following message:"
    echo " -> $COMMIT_MESSAGE"

    mv $DIST_DIR .tmp
    git fetch
    git checkout $STATIC_APP_BRANCH
    mkdir $OUTPUT_ROOT_DIR || \
      echo " -> Creating dir '$OUTPUT_ROOT_DIR' can fail safely"
    rm -r $FULL_PATH_DIR || \
      echo " -> Removing '$FULL_PATH_DIR' can fail safely"
    mv .tmp $FULL_PATH_DIR
    git status
    git status | grep "$FULL_PATH_DIR" && \
      echo " -> Changes detected in new build" && \
      git add "$FULL_PATH_DIR" && \
      git commit -m "$COMMIT_MESSAGE" || \
      echo "No changes on $FULL_PATH_DIR to commit! Moving on"

    echo "Trying to push new changes to $STATIC_APP_BRANCH"
    COUNTER=0
    function retry() {
      echo "Retrying... count: $COUNTER"
      git pull origin $STATIC_APP_BRANCH
      git push origin $STATIC_APP_BRANCH
      if [ $? -ne 0 ]; then
        if [ $COUNTER -lt 5 ]; then
          ((COUNTER=COUNTER+1))
          retry
        fi
      fi
    }
    retry
  `).then(() => {
    console.log('Succefully set things up');
  });
}
