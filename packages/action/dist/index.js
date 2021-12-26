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
exports.run = void 0;
const github = __importStar(require("@actions/github"));
const core_1 = require("@actions/core");
const handlers = __importStar(require("./actions-handlers"));
const git = __importStar(require("./utils/git"));
const params_from_payload_1 = require("./utils/params-from-payload");
const interface_1 = require("./interface");
const log_error_1 = require("./utils/log-error");
exports.run = (0, log_error_1.withError)(function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = github.context.payload;
        const sanitizedParams = (0, params_from_payload_1.getParamsFromPayload)(payload);
        (0, core_1.info)('Review Apps start!');
        yield git.configure(sanitizedParams);
        switch (payload.action) {
            case interface_1.PullRequestAction.CLOSED:
                return yield handlers.onClosed(sanitizedParams);
            default:
                return yield handlers.onDefault(sanitizedParams);
        }
    });
});
(0, exports.run)();
