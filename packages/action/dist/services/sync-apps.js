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
exports.syncApps = void 0;
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const exec_1 = require("@actions/exec");
const fileManager = __importStar(require("../utils/file-manager"));
const git = __importStar(require("../utils/git"));
const manifest = __importStar(require("../utils/manifest"));
const retry_1 = require("../utils/retry");
const log_error_1 = require("../utils/log-error");
const comment_app_info_1 = require("./comment-app-info");
const user_input_1 = require("../utils/user-input");
exports.syncApps = (0, log_error_1.withError)(function syncApps(params) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info(`
    -> Your apps will be hosted in github pages:
    -> "https://${params.repository.owner}.github.io/${params.repository.name}"
  `);
        for (const app of (0, user_input_1.userInput)().apps) {
            yield syncApp(params, app);
        }
    });
});
const syncApp = (0, log_error_1.withError)(function syncApp(params, app) {
    return __awaiter(this, void 0, void 0, function* () {
        yield optionalBuildApp(params, app);
        const paths = fileManager.paths(params, app);
        core.debug(`
    -> Current working branch: ${params.branch.name}"
    -> Will move (and override) the build result on '${app.dist}' to '${paths.byHeadCommit}' in ${(0, user_input_1.userInput)().ghPagesBranch}"
  `);
        yield git.stageChanges([app.dist]);
        yield git.commit(`Persisting dist output for ${app.slug}`);
        yield (0, retry_1.retry)(5)(updateApp.bind(null, params, app));
        core.debug('Return to original state');
        yield git.hardReset(params.branch.name);
    });
});
function updateApp(params, app) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = fileManager.paths(params, app);
        yield git.hardReset((0, user_input_1.userInput)().ghPagesBranch);
        yield git.getFilesFromOtherBranch(params.branch.name, app.dist);
        manifest.replaceApp(params, app);
        core.debug('Copying from input.dist to -> ' + paths.byHeadCommit);
        core.debug(app.dist + '->' + paths.byHeadCommit);
        yield io.cp(app.dist, paths.byHeadCommit, {
            recursive: true,
            force: true,
        });
        core.debug('Finished copying');
        yield git.stageChanges([
            paths.byHeadCommit,
            !(0, user_input_1.userInput)().skipIndexHtml && 'index.html',
            'manifest.json',
        ]);
        yield git.commit(`Updating app ${paths.byHeadCommit}`);
        yield git.push((0, user_input_1.userInput)().ghPagesBranch);
        yield (0, comment_app_info_1.commentAppInfo)(params);
    });
}
const optionalBuildApp = (0, log_error_1.withError)(function optionalBuildApp(params, app) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!app.build) {
            core.info(`
    -> NO "buildCmd" passed, skipping build phase
    `);
            return;
        }
        const paths = fileManager.paths(params, app);
        const PUBLIC_URL = `/${paths.byRepo}/${paths.byHeadCommit}`;
        core.info(`
    -> BUILDING APP: ${app.slug}

    -> We'll build your app with the proper PUBLIC_URL: ${PUBLIC_URL}
    -> That way you can use relative links inside your app.
    -> For more info:
    -> https://github.com/facebook/create-react-app/pull/937/files#diff-9b26877ecf8d15b7987c96e5a17502f6
    -> https://www.gatsbyjs.com/docs/path-prefix/
  `);
        yield git.hardReset(params.branch.name);
        core.exportVariable('PUBLIC_URL', PUBLIC_URL);
        yield (0, log_error_1.withError)(exec_1.exec)(app.build);
    });
});
