"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamsFromPayload = void 0;
const core_1 = require("@actions/core");
const interface_1 = require("../interface");
function getParamsFromPayload(payload) {
    var _a, _b;
    (0, core_1.debug)('CALL getParamsFromPayload');
    (0, core_1.debug)('WITH payload');
    (0, core_1.debug)(JSON.stringify(payload, null, 2));
    switch (payload.action) {
        case interface_1.PullRequestAction.OPENED:
        case interface_1.PullRequestAction.CLOSED:
        case interface_1.PullRequestAction.SYNCHRONIZE:
        case interface_1.PullRequestAction.LABELED:
            return {
                action: payload.action,
                user: {
                    name: (_a = payload.sender) === null || _a === void 0 ? void 0 : _a.name,
                    email: (_b = payload.sender) === null || _b === void 0 ? void 0 : _b.email,
                },
                repository: {
                    name: payload.repository.name,
                },
                branch: {
                    name: payload.pull_request.head.ref.split('/').pop(),
                    headCommit: payload.pull_request.head.sha,
                    pullRequest: {
                        url: payload.pull_request.html_url,
                    },
                },
            };
        case interface_1.PullRequestAction.PUSH:
            return {
                action: payload.action,
                user: {
                    name: payload.pusher.name,
                    email: payload.pusher.email,
                },
                repository: {
                    name: payload.repository.name,
                },
                branch: {
                    name: payload.ref.split('/').pop(),
                    headCommit: payload.head_commit.id,
                    pullRequest: {
                        url: undefined,
                    },
                },
            };
        default:
            (0, core_1.setFailed)(`unhandled payload action: ${payload.action}`);
            throw new Error(`unhandled payload action: ${payload.action}`);
    }
}
exports.getParamsFromPayload = getParamsFromPayload;
