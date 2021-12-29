import { getInput } from '@actions/core';
import { UserInput } from '../interface';

export function userInput(): UserInput {
  return {
    dist: getInput('dist'),
    slug: getInput('slug'),
    branch: getInput('branch'),
    buildCmd: getInput('build-cmd'),
    githubToken: getInput('GITHUB_TOKEN'),
    skipIndexHtml: getInput('skip-index-html'),
  };
}
