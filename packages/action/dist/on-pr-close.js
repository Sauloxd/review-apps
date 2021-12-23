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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.onPrClose = void 0;
const io = __importStar(require("@actions/io"));
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
const fs = __importStar(require("fs"));
const index_page_1 = require("./template/index-page");
const manifest_1 = require("./utils/manifest");
const retry_1 = require("./utils/retry");
function onPrClose({ branchName, commitMessage, ghBranch, pathByBranch, pathByHeadCommit, slug, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield retry_1.retry(5)(() => __awaiter(this, void 0, void 0, function* () {
            yield exec_1.exec('git', ['fetch', 'origin', ghBranch]);
            yield exec_1.exec('git', ['checkout', '-f', ghBranch]);
            yield exec_1.exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
            yield io.rmRF(pathByBranch);
            const manifest = manifest_1.removeApp({ manifest: manifest_1.getManifest(), branchName, slug });
            core.debug(JSON.stringify(manifest, null, 2));
            fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
            fs.writeFileSync('index.html', index_page_1.indexPage(manifest), 'utf-8');
            try {
                yield exec_1.exec('git', [
                    'add',
                    pathByHeadCommit,
                    'index.html',
                    'manifest.json',
                ]);
                yield exec_1.exec('git', ['commit', '-m', commitMessage]);
            }
            catch (e) {
                core.debug(e);
            }
            yield exec_1.exec('git', ['push', 'origin', ghBranch]);
        }));
    });
}
exports.onPrClose = onPrClose;
