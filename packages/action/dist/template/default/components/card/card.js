"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mustache_1 = require("mustache");
const to_html_1 = require("../../to-html");
const html = (0, to_html_1.toHtml)(__dirname, 'card.html');
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
