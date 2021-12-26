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
exports.removeAllAppsFromBranch = exports.paths = void 0;
const io = __importStar(require("@actions/io"));
const log_error_1 = require("./log-error");
const user_input_1 = require("./user-input");
function paths({ branch, repository, }) {
    const { slug } = (0, user_input_1.userInput)();
    const byRepo = repository.name;
    const byBranch = `${slug}/${branch.name}`;
    const byHeadCommit = `${byBranch}/${branch.headCommit.slice(0, 6)}`;
    return {
        byRepo,
        byBranch,
        byHeadCommit,
    };
}
exports.paths = paths;
exports.removeAllAppsFromBranch = (0, log_error_1.withError)(function removeAllAppsFromBranch(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { byBranch } = paths(params);
        yield io.rmRF(byBranch);
    });
});
