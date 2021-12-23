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
exports.otherEvents = void 0;
const io = __importStar(require("@actions/io"));
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
const fs = __importStar(require("fs"));
const index_page_1 = require("./template/index-page");
const manifest_1 = require("./utils/manifest");
const retry_1 = require("./utils/retry");
function otherEvents({ branchName, buildCmd, commitMessage, distDir, ghBranch, headCommitId, pathByHeadCommit, pathByRepo, pullRequestUrl, slug, }) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`
    -> Paths:
    -> Your app will be hosted in github pages: "https://{ username }.github.io"
    -> Inside the repository name as prefix: "/{ repo }" (/${pathByRepo})
    -> And this action will append even more prefixes, so multiple apps can live inside
    -> "/{ slug }/{ branch }/{ head_commit }" (/${pathByHeadCommit})

    -> Example:
    -> "https://sauloxd.github.io/review-apps/storybook/feature-1/c1fcf15"

    -> We'll build your app with the proper PUBLIC_URL
    -> For more info:
    -> https://github.com/facebook/create-react-app/pull/937/files#diff-9b26877ecf8d15b7987c96e5a17502f6
    -> https://www.gatsbyjs.com/docs/path-prefix/
  `);
        core.debug(`
    -> Building app
  `);
        core.exportVariable('PUBLIC_URL', `/${pathByRepo}/${pathByHeadCommit}`);
        yield exec_1.exec(buildCmd);
        core.debug(`
    -> Current working branch: ${branchName}"
    -> Will move (and override) the build result on '${distDir}' to '${pathByHeadCommit}' in ${ghBranch}"
    -> Finally, will commit and push with the following message:"
    -> ${commitMessage}"
  `);
        yield exec_1.exec('mv', [distDir, '.tmp']);
        yield exec_1.exec('git', ['fetch', 'origin', ghBranch]);
        yield exec_1.exec('git', ['checkout', '-f', ghBranch]);
        const manifest = manifest_1.replaceApp({
            manifest: manifest_1.getManifest(),
            branchName,
            slug,
            headCommitId,
            pathByHeadCommit,
            pullRequestUrl,
        });
        core.debug(JSON.stringify(manifest, null, 2));
        const retry5 = retry_1.retry(5);
        yield retry5(() => __awaiter(this, void 0, void 0, function* () {
            yield exec_1.exec('git', ['fetch', 'origin', ghBranch]);
            yield exec_1.exec('git', ['checkout', '-f', ghBranch]);
            yield exec_1.exec('git', ['reset', '--hard', 'origin/' + ghBranch]);
            core.debug('Coping .tmp/. -> ' + pathByHeadCommit);
            yield io.cp('.tmp/.', pathByHeadCommit, { recursive: true, force: true });
            core.debug('Saving manifest.json');
            fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
            core.debug('Saving index.html');
            fs.writeFileSync('index.html', index_page_1.indexPage(manifest), 'utf-8');
            yield exec_1.exec('git', ['status']);
            try {
                yield exec_1.exec('git', ['add', pathByHeadCommit]);
                yield exec_1.exec('git', ['add', 'index.html']);
                yield exec_1.exec('git', ['add', 'manifest.json']);
                yield exec_1.exec('git', ['commit', '-m', commitMessage]);
            }
            catch (e) {
                core.debug(e);
            }
            yield exec_1.exec('git', ['push', 'origin', ghBranch]);
        }));
        yield io.rmRF('.tmp');
        core.debug('Return to original state');
        yield exec_1.exec('git', ['fetch', 'origin', branchName]);
        yield exec_1.exec('git', ['checkout', branchName]);
    });
}
exports.otherEvents = otherEvents;
