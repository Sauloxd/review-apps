"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInput = void 0;
const core_1 = require("@actions/core");
const core_2 = require("@actions/core");
let sanitizedUserInput = null;
function userInput() {
    if (sanitizedUserInput)
        return sanitizedUserInput;
    (0, core_1.info)('-> Validating user input');
    const sanitizedInput = {
        dist: (0, core_2.getInput)('dist'),
        slug: ((0, core_2.getInput)('slug') || 'FAILED_TO_GET_SLUG').replace(/ /g, '-'),
        ghPagesBranch: (0, core_2.getInput)('branch'),
        buildCmd: (0, core_2.getInput)('build-cmd'),
        githubToken: (0, core_2.getInput)('GITHUB_TOKEN'),
        skipIndexHtml: (0, core_2.getInput)('skip-index-html') === 'true',
        apps: JSON.parse((0, core_2.getInput)('apps')),
    };
    validateApps(sanitizedInput.apps);
    sanitizedUserInput = Object.assign(Object.assign({}, sanitizedInput), { apps: Object.entries(Object.assign(Object.assign({}, sanitizedInput.apps), { [sanitizedInput.slug]: {
                build: sanitizedInput.buildCmd,
                dist: sanitizedInput.dist,
            } })).map(([slug, app]) => (Object.assign({ slug }, app))) });
    return sanitizedInput;
}
exports.userInput = userInput;
const validateApps = (apps) => {
    Object.entries(apps).forEach(([_key, value]) => {
        if (!value.dist) {
            (0, core_1.setFailed)('-> Invalid user input: input.apps.dist is mandatory!');
            (0, core_1.debug)(`-> Invalid user input: input.apps.dist is mandatory! ${JSON.stringify(value)}`);
        }
    });
};
