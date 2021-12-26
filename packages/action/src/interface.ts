export enum PullRequestAction {
  OPENED = 'opened',
  CLOSED = 'closed',
  SYNCHRONIZE = 'synchronize',
  LABELED = 'labeled',
  PUSH = 'push',
}

export interface SanitizedPayloadParams {
  action?: PullRequestAction;
  user: {
    name: string;
    email: string;
  };
  repository: {
    name: string;
    owner: string;
  };
  branch: {
    name: string;
    headCommit: string;
    pullRequest: {
      url?: string;
    };
  };
}

export interface GithubPullRequestPayload {
  repository: {
    name: string;
  };
  pull_request: {
    head: {
      ref: string;
      sha: string;
    };
    html_url: string;
  };
  pusher: {
    name: string;
    email: string;
  };
}

export interface UserInput {
  dist: string;
  slug: string;
  branch: string;
  buildCmd: string;
}

export interface FileManagerPaths {
  byRepo: string;
  byBranch: string;
  byHeadCommit: string;
}

export type App = {
  name: string;
  headCommitId: string;
  updatedAt: Date;
  href: string;
  pullRequestUrl?: string;
};

export interface Manifest {
  [branch: string]: {
    apps: App[];
  };
}
