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

  const sanitizedInput = {
    dist: getInput('dist'),
    slug: (getInput('slug') || 'FAILED_TO_GET_SLUG').replace(/ /g, '-'),
    ghPagesBranch: getInput('branch'),
    buildCmd: getInput('build-cmd'),
    githubToken: getInput('GITHUB_TOKEN'),
    skipIndexHtml: getInput('skip-index-html') === 'true',
    apps: JSON.parse(getInput('apps')),
  };

  validateApps(sanitizedInput.apps);

  sanitizedUserInput = {
    ...sanitizedInput,
    apps: Object.entries({
      ...sanitizedInput.apps,
      [sanitizedInput.slug]: {
        build: sanitizedInput.buildCmd,
        dist: sanitizedInput.dist,
      },
    } as InputApp).map(([slug, app]) => ({
      slug,
      ...app,
    })),
  };

  return sanitizedInput;
}

const validateApps = (apps: InputApp) => {
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
