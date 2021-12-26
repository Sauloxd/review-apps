"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestAction = exports.GithubTriggerActions = void 0;
var GithubTriggerActions;
(function (GithubTriggerActions) {
    GithubTriggerActions["PUSH"] = "push";
    GithubTriggerActions["PULL_REQUEST"] = "push";
})(GithubTriggerActions = exports.GithubTriggerActions || (exports.GithubTriggerActions = {}));
var PullRequestAction;
(function (PullRequestAction) {
    PullRequestAction["OPENED"] = "opened";
    PullRequestAction["CLOSED"] = "closed";
    PullRequestAction["SYNCHRONIZE"] = "synchronize";
    PullRequestAction["LABELED"] = "labeled";
    PullRequestAction["PUSH"] = "push";
})(PullRequestAction = exports.PullRequestAction || (exports.PullRequestAction = {}));
