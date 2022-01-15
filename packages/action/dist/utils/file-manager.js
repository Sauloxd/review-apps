"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paths = void 0;
function paths(params, app) {
    const byRepo = params.repository.name;
    const byBranch = `${params.branch.name}/${app.slug}`;
    const byHeadCommit = `${byBranch}/${params.branch.headCommit.slice(0, 6)}`;
    return {
        byRepo,
        byBranch,
        byHeadCommit,
    };
}
exports.paths = paths;
