"use strict";
exports.__esModule = true;
exports.userInput = void 0;
var core_1 = require("@actions/core");
function userInput() {
    return {
        dist: (0, core_1.getInput)('dist'),
        slug: (0, core_1.getInput)('slug'),
        branch: (0, core_1.getInput)('branch'),
        buildCmd: (0, core_1.getInput)('build-cmd')
    };
}
exports.userInput = userInput;
