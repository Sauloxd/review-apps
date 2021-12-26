import * as core from '@actions/core';

export function retry(times: number) {
  return async function r(cb: () => Promise<void>, count = 0) {
    try {
      await cb();
    } catch (e) {
      core.debug((e as any).message as any);
      if (count < times) {
        core.debug(`Retrying... ${count}`);
        await r(cb, count + 1);
      } else {
        core.debug(`Exhausted retries: ${count}`);
        throw new Error('Retry failed');
      }
    }
  };
}
