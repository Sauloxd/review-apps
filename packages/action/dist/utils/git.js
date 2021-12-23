"use strict";
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
exports.getFilesFromOtherBranch = exports.push = exports.commit = exports.stageChanges = exports.decorateMessage = exports.hardReset = exports.configure = void 0;
const exec_1 = require("@actions/exec");
const core_1 = require("@actions/core");
const user_input_1 = require("../utils/user-input");
function configure(params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['config', '--global', 'user.name', params.user.name]);
        yield (0, exec_1.exec)('git', ['config', '--global', 'user.email', params.user.email]);
        yield (0, exec_1.exec)('git', ['config', 'pull.rebase', 'true']);
    });
}
exports.configure = configure;
function hardReset(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, core_1.debug)('CALL hardReset');
        (0, core_1.debug)(`WITH branch: ${branch}`);
        yield (0, exec_1.exec)('git', ['fetch', 'origin', branch]);
        yield (0, exec_1.exec)('git', ['checkout', '-f', branch]);
        yield (0, exec_1.exec)('git', ['reset', '--hard', 'origin/' + branch]);
    });
}
exports.hardReset = hardReset;
function decorateMessage(message) {
    const input = (0, user_input_1.userInput)();
    return `[skip ci] ${input.slug} - ${message}`;
}
exports.decorateMessage = decorateMessage;
function stageChanges(...files) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['add', ...files]);
    });
}
exports.stageChanges = stageChanges;
function commit(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['commit', '-m', decorateMessage(message)]);
    });
}
exports.commit = commit;
function push(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['push', 'origin', branch]);
    });
}
exports.push = push;
function getFilesFromOtherBranch(branch, fileOrDirName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['checkout', branch, fileOrDirName]);
    });
}
exports.getFilesFromOtherBranch = getFilesFromOtherBranch;
