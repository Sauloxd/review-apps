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
exports.onClosed = void 0;
const retry_1 = require("../utils/retry");
const user_input_1 = require("../utils/user-input");
const git = __importStar(require("../utils/git"));
const manifest = __importStar(require("../utils/manifest"));
const fileManager = __importStar(require("../utils/file-manager"));
function onClosed(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = (0, user_input_1.userInput)();
        const { byHeadCommit } = fileManager.paths(params);
        yield (0, retry_1.retry)(5)(() => __awaiter(this, void 0, void 0, function* () {
            yield git.hardReset(input.branch);
            yield fileManager.removeAllAppsFromBranch(params);
            manifest.removeApp(params.branch.name);
            yield git.stageChanges(byHeadCommit, 'index.html', 'manifest.json');
            yield git.commit(git.decorateMessage(`Removing branch ${params.branch.name}`));
            yield git.push(input.branch);
        }));
    });
}
exports.onClosed = onClosed;
