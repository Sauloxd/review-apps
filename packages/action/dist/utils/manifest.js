"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceApp = exports.getManifest = exports.removeApp = void 0;
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const index_page_1 = require("../template/index-page");
const fileManager = __importStar(require("./file-manager"));
const user_input_1 = require("./user-input");
function removeApp(branch) {
    core.debug('CALL removeApp');
    core.debug(`WITH branch ${branch}`);
    const manifest = getManifest();
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
    core.debug(`WITH branch ${params.branch.name}`);
    const manifest = getManifest();
    const input = (0, user_input_1.userInput)();
    const apps = ((_a = manifest[params.branch.name]) === null || _a === void 0 ? void 0 : _a.apps) || [];
    const index = apps.findIndex((app) => app.name === input.slug);
    const newApp = buildApp(params);
    if (index > 0) {
        apps[index] = newApp;
    }
    else {
        apps.push(newApp);
    }
    manifest[params.branch.name] = Object.assign(Object.assign({}, manifest[params.branch.name]), { apps });
    core.debug(JSON.stringify(manifest, null, 2));
    core.debug('Saving manifest.json');
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
    core.debug('Saving index.html');
    fs.writeFileSync('index.html', (0, index_page_1.indexPage)(manifest), 'utf-8');
    return manifest;
}
exports.replaceApp = replaceApp;
function buildApp(params) {
    const input = (0, user_input_1.userInput)();
    const paths = fileManager.paths(params);
    return {
        name: input.slug,
        headCommit: params.branch.headCommit,
        updatedAt: new Date(),
        href: paths.byHeadCommit,
        pullRequestUrl: params.branch.pullRequest.url,
    };
}
