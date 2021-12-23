import * as io from '@actions/io';
import { FileManagerPaths, SanitizedPayloadParams } from '../interface';
import { userInput } from './user-input';

export function paths({
  branch,
  repository,
}: SanitizedPayloadParams): FileManagerPaths {
  const { slug } = userInput();
  const byRepo = repository.name;
  const byBranch = `${slug}/${branch.name}`;
  const byHeadCommit = `${byBranch}/${branch.headCommit.slice(0, 6)}`;

  return {
    byRepo,
    byBranch,
    byHeadCommit,
  };
}

export async function removeAllAppsFromBranch(params: SanitizedPayloadParams) {
  const { byBranch } = paths(params);
  await io.rmRF(byBranch);
}
