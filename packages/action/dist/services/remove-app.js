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
exports.removeApp = void 0;
const core_1 = require("@actions/core");
const io = __importStar(require("@actions/io"));
const git = __importStar(require("../utils/git"));
const manifest = __importStar(require("../utils/manifest"));
const retry_1 = require("../utils/retry");
const log_error_1 = require("../utils/log-error");
const user_input_1 = require("../utils/user-input");
exports.removeApp = (0, log_error_1.withError)(function removeApp(params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, retry_1.retry)(5)(() => __awaiter(this, void 0, void 0, function* () {
            yield git.hardReset((0, user_input_1.userInput)().ghPagesBranch);
            yield io.rmRF(params.branch.name);
            manifest.removeApp(params.branch.name);
            yield git.stageChanges([
                params.branch.name,
                !(0, user_input_1.userInput)().skipIndexHtml && 'index.html',
                'manifest.json',
            ]);
            yield git.commit(git.decorateMessage(`Removing branch: ${params.branch.name}`));
            yield git.push((0, user_input_1.userInput)().ghPagesBranch);
        }));
        (0, core_1.debug)('Return to original state');
        yield git.hardReset(params.branch.name);
    });
});
