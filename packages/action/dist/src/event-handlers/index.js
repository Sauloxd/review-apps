"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPullRequest = exports.onPush = void 0;
var on_push_1 = require("./on-push");
Object.defineProperty(exports, "onPush", { enumerable: true, get: function () { return on_push_1.onPush; } });
var on_pull_request_1 = require("./on-pull-request");
Object.defineProperty(exports, "onPullRequest", { enumerable: true, get: function () { return on_pull_request_1.onPullRequest; } });
