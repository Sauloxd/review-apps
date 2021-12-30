"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInput = void 0;
const core_1 = require("@actions/core");
function userInput() {
    return {
        dist: (0, core_1.getInput)('dist'),
        slug: ((0, core_1.getInput)('slug') || 'FAILED_TO_GET_SLUG').replace(/ /g, '-'),
        branch: (0, core_1.getInput)('branch'),
        buildCmd: (0, core_1.getInput)('build-cmd'),
        githubToken: (0, core_1.getInput)('GITHUB_TOKEN'),
        skipIndexHtml: (0, core_1.getInput)('skip-index-html') === 'true',
    };
}
exports.userInput = userInput;
