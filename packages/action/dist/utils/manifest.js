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
exports.removeApp = (0, log_error_1.withError)(function removeApp(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        const manifest = getManifest();
        delete manifest[branch];
        syncManifest(manifest);
    });
});
exports.replaceApp = (0, log_error_1.withError)(function replaceApp(params) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const manifest = getManifest();
        const input = (0, user_input_1.userInput)();
        const apps = ((_a = manifest[params.branch.name]) === null || _a === void 0 ? void 0 : _a.apps) || [];
        const index = apps.findIndex((app) => app.name === input.slug);
        const newApp = buildApp(params);
        if (index > -1) {
            apps[index] = newApp;
        }
        else {
            apps.push(newApp);
        }
        manifest[params.branch.name] = Object.assign(Object.assign({}, manifest[params.branch.name]), { apps });
        syncManifest(manifest);
    });
});
function getBranchPaths(branch) {
    const manifest = getManifest();
    return manifest[branch];
}
exports.getBranchPaths = getBranchPaths;
function githubPagesUrl(params) {
    const paths = fileManager.paths(params);
    return `https://${params.repository.owner}.github.io/${params.repository.name}/${paths.byHeadCommit}`;
}
exports.githubPagesUrl = githubPagesUrl;
function syncManifest(manifest) {
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
    fs.writeFileSync('index.html', (0, default_1.defaultPage)(manifest), 'utf-8');
}
function buildApp(params) {
    const input = (0, user_input_1.userInput)();
    const paths = fileManager.paths(params);
    return {
        name: input.slug,
        headCommitId: params.branch.headCommit,
        updatedAt: new Date(),
        href: paths.byHeadCommit,
        pullRequestUrl: params.branch.pullRequest.url,
        githubPagesUrl: githubPagesUrl(params),
    };
}
function getManifest() {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf-8'));
    core.debug('CALL getManifest');
    core.debug(JSON.stringify(manifest, null, 2));
    return manifest;
}
