import * as core from '@actions/core';
import { createReviewApp } from './create-review-app';

(async function () {
  try {
    await createReviewApp();
  } catch (error) {
    core.debug('-> Program failed');
    core.setFailed(error);
    throw error;
  }
})();
