"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.replaceApp = exports.getManifest = exports.removeApp = void 0;
var fs = require("fs");
var core = require("@actions/core");
var index_page_1 = require("../template/index-page");
var fileManager = require("./file-manager");
var user_input_1 = require("./user-input");
function removeApp(branch) {
    core.debug('CALL removeApp');
    core.debug("WITH branch ".concat(branch));
    var manifest = getManifest();
    delete manifest[branch];
    core.debug(JSON.stringify(manifest, null, 2));
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
    fs.writeFileSync('index.html', (0, index_page_1.indexPage)(manifest), 'utf-8');
}
exports.removeApp = removeApp;
function getManifest() {
    try {
        return JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
    }
    catch (e) {
        core.setFailed('Failed to get manifest');
        throw new Error('Failed to get manifest');
    }
}
exports.getManifest = getManifest;
function replaceApp(params) {
    var _a;
    core.debug('CALL replaceApp');
    core.debug("WITH branch ".concat(params.branch.name));
    var manifest = getManifest();
    var input = (0, user_input_1.userInput)();
    var apps = ((_a = manifest[params.branch.name]) === null || _a === void 0 ? void 0 : _a.apps) || [];
    var index = apps.findIndex(function (app) { return app.name === input.slug; });
    var newApp = buildApp(params);
    if (index > 0) {
        apps[index] = newApp;
    }
    else {
        apps.push(newApp);
    }
    manifest[params.branch.name] = __assign(__assign({}, manifest[params.branch.name]), { apps: apps });
    core.debug(JSON.stringify(manifest, null, 2));
    core.debug('Saving manifest.json');
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
    core.debug('Saving index.html');
    fs.writeFileSync('index.html', (0, index_page_1.indexPage)(manifest), 'utf-8');
    return manifest;
}
exports.replaceApp = replaceApp;
function buildApp(params) {
    var input = (0, user_input_1.userInput)();
    var paths = fileManager.paths(params);
    return {
        name: input.slug,
        headCommit: params.branch.headCommit,
        updatedAt: new Date(),
        href: paths.byHeadCommit,
        pullRequestUrl: params.branch.pullRequest.url
    };
}
