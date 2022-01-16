import * as core from '@actions/core';

export function withError<T extends (...args: any[]) => any>(
  cb: T
): (...funcArgs: Parameters<T>) => Promise<ReturnType<T>> {
  // Return a new function that tracks how long the original took
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    core.debug(`CALL ${cb.name}`);
    core.debug(`WITH ${JSON.stringify(args, null, 2)}`);
    try {
      return await cb(...args);
    } catch (e) {
      core.setFailed(`FAILED ${cb.name}`);
      core.debug((e as any).message as string);
      throw e;
    }
  };
}
