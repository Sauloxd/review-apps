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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceApp = exports.removeApp = exports.getManifest = void 0;
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
function getManifest() {
    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
    }
    catch (e) {
        core.debug('Failed to get manifest');
        manifest = {};
    }
    return manifest;
}
exports.getManifest = getManifest;
function removeApp({ manifest, branchName, slug }) {
    let newManifest = JSON.parse(JSON.stringify(manifest));
    const apps = ((newManifest[branchName] && newManifest[branchName].apps) ||
        []).filter((app) => app.name !== slug);
    if (apps.length === 0) {
        newManifest = Object.keys(newManifest).reduce((acc, key) => {
            if (key === branchName)
                return acc;
            return Object.assign(Object.assign({}, acc), { [key]: newManifest[key] });
        }, {});
    }
    else {
        newManifest[branchName] = Object.assign(Object.assign({}, newManifest[branchName]), { apps });
    }
    return newManifest;
}
exports.removeApp = removeApp;
function replaceApp({ manifest, branchName, slug, headCommitId, pathByHeadCommit, pullRequestUrl, }) {
    const newManifest = JSON.parse(JSON.stringify(manifest));
    const apps = ((newManifest[branchName] && newManifest[branchName].apps) ||
        []).filter((app) => app.name !== slug);
    newManifest[branchName] = Object.assign(Object.assign({}, newManifest[branchName]), { apps: apps.concat({
            name: slug,
            headCommitId,
            updatedAt: new Date(),
            href: pathByHeadCommit,
            pullRequestUrl,
        }) });
    return newManifest;
}
exports.replaceApp = replaceApp;
