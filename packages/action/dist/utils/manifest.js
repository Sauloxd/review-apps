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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubPagesUrl = exports.getBranchPaths = exports.replaceApp = exports.removeApp = void 0;
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const default_1 = require("../template/default");
const fileManager = __importStar(require("./file-manager"));
const user_input_1 = require("./user-input");
const log_error_1 = require("./log-error");
// Due to poorly designed API,
// All functions here that depends on `getManifest()`
// will break if operations are called outside "github pages" branch!
exports.removeApp = (0, log_error_1.withError)(function removeApp(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        const manifest = getManifest();
        delete manifest[branch];
        syncManifest(manifest);
    });
});
const replaceApp = function replaceApp(params, appInput) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const manifest = getManifest();
        const apps = ((_a = manifest[params.branch.name]) === null || _a === void 0 ? void 0 : _a.apps) || [];
        const index = apps.findIndex((app) => app.name === appInput.slug);
        const newApp = buildApp(params, appInput);
        if (index > -1) {
            apps[index] = newApp;
        }
        else {
            apps.push(newApp);
        }
        manifest[params.branch.name] = Object.assign(Object.assign({}, manifest[params.branch.name]), { apps });
        syncManifest(manifest);
    });
};
exports.replaceApp = replaceApp;
function getBranchPaths(branch) {
    const manifest = getManifest();
    return manifest[branch];
}
exports.getBranchPaths = getBranchPaths;
function githubPagesUrl(params, app) {
    const paths = fileManager.paths(params, app);
    return `https://${params.repository.owner}.github.io/${params.repository.name}/${paths.byHeadCommit}`;
}
exports.githubPagesUrl = githubPagesUrl;
function syncManifest(manifest) {
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
    if (!(0, user_input_1.userInput)().skipIndexHtml) {
        core.debug('Creating index.html');
        fs.writeFileSync('index.html', (0, default_1.defaultPage)(manifest), 'utf-8');
    }
    else {
        core.debug('Skipping index.html');
    }
}
function buildApp(params, app) {
    const paths = fileManager.paths(params, app);
    return {
        name: app.slug,
        headCommitId: params.branch.headCommit,
        updatedAt: new Date(),
        href: paths.byHeadCommit,
        pullRequestUrl: params.branch.pullRequest.url,
        githubPagesUrl: githubPagesUrl(params, app),
    };
}
function getManifest() {
    let manifest = {};
    try {
        manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
    }
    catch (e) {
        core.debug(JSON.stringify(manifest, null, 2));
    }
    return manifest;
}
