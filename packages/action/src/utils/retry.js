const core = require('@actions/core');

module.exports = retry;

function retry(times) {
  return async function r(cb, count = 0) {
    try {
      await cb();
    } catch (e) {
      core.debug(e);
      if (count < times) {
        core.debug('Retrying... ', count);
        await r(cb, count + 1);
      } else {
        core.debug('Exhausted retries: ', count);
        throw new Error('Retry failed');
      }
    }
  };
}
