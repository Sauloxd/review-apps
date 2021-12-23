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
exports.createReviewApp = void 0;
const github = __importStar(require("@actions/github"));
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const on_pr_close_1 = require("./on-pr-close");
const params_from_payload_1 = require("./utils/params-from-payload");
const other_events_1 = require("./other-events");
function createReviewApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const distDir = core_1.getInput('dist');
        const slug = core_1.getInput('slug');
        const ghBranch = core_1.getInput('branch');
        const buildCmd = core_1.getInput('build-cmd');
        const { userName, userEmail, headCommitId, branchName, repositoryName, pullRequestUrl, isClosePrEvent, } = params_from_payload_1.getParamsFromPayload(github.context.payload);
        core_1.info('Review Apps');
        core_1.info(`Setting config options - name:${userName}, email:${userEmail}`);
        yield exec_1.exec('git', ['config', '--global', 'user.name', userName]);
        yield exec_1.exec('git', ['config', '--global', 'user.email', userEmail]);
        yield exec_1.exec('git', ['config', 'pull.rebase', 'true']);
        const commitMessage = `[skip ci] ref to ${headCommitId} for - ${slug}`;
        const pathByRepo = repositoryName;
        const pathByBranch = `${slug}/${branchName}`;
        const pathByHeadCommit = `${pathByBranch}/${headCommitId.substr(0, 6)}`;
        if (isClosePrEvent) {
            yield on_pr_close_1.onPrClose({
                branchName,
                commitMessage,
                ghBranch,
                pathByBranch,
                pathByHeadCommit,
                slug,
            });
        }
        else {
            yield other_events_1.otherEvents({
                branchName,
                buildCmd,
                commitMessage,
                distDir,
                ghBranch,
                headCommitId,
                pathByHeadCommit,
                pathByRepo,
                pullRequestUrl,
                slug,
            });
        }
    });
}
exports.createReviewApp = createReviewApp;
