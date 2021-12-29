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
exports.commentAppInfo = void 0;
const core_1 = require("@actions/core");
const github = __importStar(require("@actions/github"));
const log_error_1 = require("../utils/log-error");
const user_input_1 = require("../utils/user-input");
const manifest = __importStar(require("../utils/manifest"));
const REVIEW_APP_ID = '# Review Apps';
exports.commentAppInfo = (0, log_error_1.withError)(function commentAppInfo(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { githubToken } = (0, user_input_1.userInput)();
        if (!githubToken) {
            (0, core_1.info)(`   -> No GITHUB_TOKEN provided! Can't manage comments for this action`);
        }
        const commentApi = CommentApi();
        const comments = yield commentApi.getReviewAppComments();
        const comment = comments[0];
        if (comments.length > 1) {
            (0, core_1.info)('   -> More than 1 comment found!');
            (0, core_1.info)('    -> We manage the comment based on the presence of "# Review Apps" string');
            (0, core_1.info)('    -> Removing comments');
            yield Promise.all(comments.slice(1).map((c) => commentApi.delete(c.id)));
        }
        const body = getCommentBody(params.branch.name);
        if (!comment) {
            (0, core_1.info)('    -> Creating comment with Review Apps details');
            yield commentApi.create(body);
        }
        else {
            (0, core_1.info)('    -> Comment found! Updating it with new info...');
            yield commentApi.update(comment.id, body);
        }
    });
});
const getCommentBody = (branch) => {
    const pathsForBranch = manifest.getBranchPaths(branch);
    const body = `
  ${REVIEW_APP_ID}
  ## URLS
  ${pathsForBranch.apps.map(formatToListedLink).join('')}
  ### Last updated at
  ${new Date().toString()}
 `;
    return body;
    function formatToListedLink(app) {
        return `- [${app.name}](app.githubPagesUrl)\n`;
    }
};
const CommentApi = () => {
    var _a;
    const { githubToken } = (0, user_input_1.userInput)();
    const octokit = github.getOctokit(githubToken);
    const context = github.context;
    const pullRequestNumber = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number;
    const commentApi = {
        create(body) {
            return octokit.rest.issues.createComment(Object.assign(Object.assign({}, context.repo), { 
                // eslint-disable-next-line
                issue_number: pullRequestNumber, body }));
        },
        getReviewAppComments() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield octokit.rest.issues.listComments(Object.assign(Object.assign({}, context.repo), { 
                    // eslint-disable-next-line
                    issue_number: pullRequestNumber }));
                return response.data.filter((d) => { var _a; return (_a = d.body) === null || _a === void 0 ? void 0 : _a.includes(REVIEW_APP_ID); });
            });
        },
        delete(id) {
            return octokit.rest.issues.deleteComment(Object.assign(Object.assign({}, context.repo), { 
                // eslint-disable-next-line
                comment_id: id }));
        },
        update(id, body) {
            return octokit.rest.issues.updateComment(Object.assign(Object.assign({}, context.repo), { 
                // eslint-disable-next-line
                comment_id: id, body }));
        },
    };
    return commentApi;
};
