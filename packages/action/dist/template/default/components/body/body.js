"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const mustache_1 = require("mustache");
const review_app_list_1 = require("../review-app-list/review-app-list");
const html = `
<div class="container">
  <div class="row">
    <div class="col-sm">
      <h1 style="margin-top: 32px; margin-bottom: 16px;">
        {{pageTitle}}
      </h1>
    </div>
  </div>
  {{emptyPlaceholder}}
  {{> children}}
</div>
`;
const Body = ({ reviewApps }) => {
    const emptyPlaceholder = Object.keys(reviewApps).length === 0 ? 'No apps available yet' : '';
    return (0, mustache_1.render)(html, {
        pageTitle: 'Static review apps collection',
        emptyPlaceholder,
    }, {
        children: (0, review_app_list_1.ReviewAppList)(reviewApps),
    });
};
exports.Body = Body;
