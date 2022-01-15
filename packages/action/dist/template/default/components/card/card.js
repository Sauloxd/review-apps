"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mustache_1 = require("mustache");
const html = `
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">{{name}}</h5>
    <h6 class="card-subtitle mb-2 text-muted">#{{headCommitShort}}</h6>
    <h6 class="card-subtitle mb-2 text-muted">{{updatedAt}}</h6>
    <a href="{{href}}" class="card-link">App</a>
    {{> children}}
  </div>
</div>
`;
const Card = (app) => (0, mustache_1.render)(html, {
    name: app.name,
    headCommitShort: app.headCommitId.slice(0, 12),
    updatedAt: app.updatedAt.toLocaleString(),
    href: app.href,
}, {
    children: app.pullRequestUrl
        ? (0, mustache_1.render)(`
          <a href="{{pullRequestUrl}}" class="card-link">Pull Request</a>
        `, { pullRequestUrl: app.pullRequestUrl })
        : '',
});
exports.Card = Card;
