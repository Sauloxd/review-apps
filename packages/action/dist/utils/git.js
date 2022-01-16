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
exports.push = exports.commit = exports.stageChanges = exports.decorateMessage = exports.hardReset = exports.configure = void 0;
const exec_1 = require("@actions/exec");
const user_input_1 = require("./user-input");
const configure = function configure({ name, email, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['--version']);
        yield (0, exec_1.exec)('git', ['config', '--global', 'user.name', name]);
        yield (0, exec_1.exec)('git', ['config', '--global', 'user.email', email]);
        yield (0, exec_1.exec)('git', ['config', 'pull.rebase', 'true']);
        yield (0, exec_1.exec)(`echo "${(0, user_input_1.userInput)().tmpDir}" >> .git/info/exclude`);
    });
};
exports.configure = configure;
const hardReset = function hardReset(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['fetch', 'origin', branch]);
        yield (0, exec_1.exec)('git', ['checkout', '-f', branch]);
        yield (0, exec_1.exec)('git', ['reset', '--hard', 'origin/' + branch]);
    });
};
exports.hardReset = hardReset;
function decorateMessage(message) {
    return `[skip ci] - ${message}`;
}
exports.decorateMessage = decorateMessage;
const stageChanges = function stageChanges(files) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['add', '-f', ...files.filter(Boolean)]);
    });
};
exports.stageChanges = stageChanges;
const commit = function commit(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['commit', '--no-verify', '-m', decorateMessage(message)]);
    });
};
exports.commit = commit;
const push = function push(branch) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, exec_1.exec)('git', ['push', 'origin', branch]);
    });
};
exports.push = push;
