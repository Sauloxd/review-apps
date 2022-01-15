import {
  FileManagerPaths,
  SanitizedPayloadParams,
  UserInput,
} from '../interface';

export function paths(
  params: SanitizedPayloadParams,
  app: UserInput['apps'][number]
): FileManagerPaths {
  const byRepo = params.repository.name;
  const byBranch = `${params.branch.name}/${app.slug}`;
  const byHeadCommit = `${byBranch}/${params.branch.headCommit.slice(0, 6)}`;

  return {
    byRepo,
    byBranch,
    byHeadCommit,
  };
}
