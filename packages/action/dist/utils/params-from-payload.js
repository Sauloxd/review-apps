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
exports.getParamsFromPayload = void 0;
const core = __importStar(require("@actions/core"));
function getParamsFromPayload(payload) {
    let userName = 'review-app-action-user';
    let userEmail = 'review-app-action-email';
    let headCommitId;
    let branchName;
    let repositoryName;
    let pullRequestUrl;
    try {
        if (['opened', 'closed', 'synchronize', 'labeled'].includes(payload.action)) {
            userName = payload.sender && payload.sender.name || userName;
            userEmail = payload.sender && payload.sender.email || userEmail;
            headCommitId = payload.pull_request.head.sha;
            branchName = payload.pull_request.head.ref.split('/').pop();
            repositoryName = payload.repository.name;
            pullRequestUrl = payload.pull_request.html_url;
        }
        if (['push'].includes(payload.action) || typeof payload.action === 'undefined') {
            userName = payload.pusher.name || userName;
            userEmail = payload.pusher.email || userEmail;
            headCommitId = payload.head_commit.id;
            branchName = payload.ref.split('/').pop();
            repositoryName = payload.repository.name;
            pullRequestUrl = undefined;
        }
    }
    catch (e) {
        core.debug(e);
        core.debug(JSON.stringify(payload, null, 2));
        throw new Error('Failed to get basic parameters');
    }
    core.debug(`-> received payload.action ${payload.action}`);
    const result = Object.assign(Object.assign({ userName,
        userEmail,
        headCommitId,
        branchName,
        repositoryName, isClosePrEvent: payload.action === 'closed' }, (pullRequestUrl ? { pullRequestUrl } : {})), (payload.action ? { action: payload.action } : {}));
    if (Object.values(result).filter(r => typeof r === 'undefined').length !== 0) {
        core.debug('-> A value is undefined');
        core.debug(JSON.stringify(payload, null, 2));
    }
    core.debug('-> Metadata:');
    core.debug(JSON.stringify(result, null, 2));
    return result;
}
exports.getParamsFromPayload = getParamsFromPayload;
