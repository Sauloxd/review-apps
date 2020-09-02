const core = require('@actions/core');
const { createReviewApp } = require('./create-review-app');

(async function () {
  try {
    await createReviewApp();
  } catch (error) {
    core.debug('-> Program failed');
    core.setFailed(error.message);
    throw error;
  }
})();
