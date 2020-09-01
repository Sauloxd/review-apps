const core = require('@actions/core');
const { createReviewApp } = require('./create-review-app');

try {
  createReviewApp();
} catch (error) {
  core.debug('-> Program failed');
  core.setFailed(error.message);
  throw error;
}
