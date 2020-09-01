const core = require('@actions/core');
const createReviewApp = require('./create-review-app');

try {
  createReviewApp();
} catch (error) {
  core.setFailed(error.message);
  throw error;
}
