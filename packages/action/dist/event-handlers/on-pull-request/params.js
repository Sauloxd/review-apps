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
exports.getParams = void 0;
const github = __importStar(require("@actions/github"));
function getParams() {
    const payload = github.context.payload;
    return {
        action: payload.action,
        repository: {
            name: payload.repository.name,
            owner: payload.repository.owner.login,
        },
        branch: {
            name: payload.pull_request.head.ref,
            headCommit: payload.pull_request.head.sha,
            pullRequest: {
                url: payload.pull_request.html_url,
            },
        },
    };
}
exports.getParams = getParams;
