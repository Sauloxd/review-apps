import * as core from '@actions/core';

export const withError =
  <P, R>(
    cb: (...params: P[]) => Promise<R | undefined>
  ): ((...params: P[]) => Promise<R | undefined>) =>
  async (...args) => {
    core.debug(`CALL ${cb.name}`);
    core.debug(`WITH ${JSON.stringify(args, null, 2)}`);
    try {
      return await cb(...args);
    } catch (e) {
      core.setFailed(`FAILED ${cb.name}`);
      core.debug((e as any).message as string);
    }
  };
