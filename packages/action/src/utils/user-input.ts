import { setFailed, debug, info } from '@actions/core';
import { getInput } from '@actions/core';
import { UserInput } from '../interface';

let sanitizedUserInput: null | UserInput = null;

type InputApp = {
  [slug: string]: {
    build?: string;
    dist: string;
  };
};

export function userInput(): UserInput {
  if (sanitizedUserInput) return sanitizedUserInput;

  info('-> Validating user input');

  let apps: InputApp;
  try {
    apps = JSON.parse(getInput('apps'));
  } catch (e) {
    setFailed(
      `Invalid "apps" value, it must be a valid JSON. Received ${getInput(
        'apps'
      )}`
    );
    debug(
      `Invalid "apps" value, it must be a valid JSON. Received ${getInput(
        'apps'
      )}`
    );
    throw e;
  }

  const sanitizedInput = {
    dist: getInput('dist'),
    slug: (getInput('slug') || 'FAILED_TO_GET_SLUG').replace(/ /g, '-'),
    ghPagesBranch: getInput('branch'),
    buildCmd: getInput('build-cmd'),
    githubToken: getInput('GITHUB_TOKEN'),
    skipIndexHtml: getInput('skip-index-html') === 'true',
    apps,
  };
  const appsSanitized = Object.entries(
    sanitizedInput.apps || {
      [sanitizedInput.slug]: {
        build: sanitizedInput.buildCmd,
        dist: sanitizedInput.dist,
      },
    }
  ).map(([slug, app]) => ({
    slug,
    ...app,
  }));

  validateApps(appsSanitized);

  sanitizedUserInput = {
    ...sanitizedInput,
    apps: appsSanitized,
  };

  return sanitizedUserInput;
}

const validateApps = (apps: UserInput['apps']) => {
  if (!apps) return;

  Object.entries(apps).forEach(([_key, value]) => {
    if (!value.dist) {
      setFailed('-> Invalid user input: input.apps.dist is mandatory!');
      debug(
        `-> Invalid user input: input.apps.dist is mandatory! ${JSON.stringify(
          value
        )}`
      );
    }
  });
};
