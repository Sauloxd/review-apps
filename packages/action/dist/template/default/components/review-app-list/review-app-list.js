"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewAppList = void 0;
const mustache_1 = require("mustache");
const card_1 = require("../card/card");
const html = `
<div>
  <div class="row">
    <div class="col-sm">
      <h2 style="margin-top: 30px;">
        {{slug}}
      </h2>
    </div>
  </div>
  <div class="row">
    {{emptyPlaceholder}}
    {{> children}}
  </div>
</div>
`;
const ReviewAppList = (reviewApps) => {
    return Object.entries(reviewApps)
        .map(([slug, reviewApp]) => {
        var _a, _b;
        const emptyPlaceholder = ((_a = reviewApp.apps) === null || _a === void 0 ? void 0 : _a.length) === 0 ? 'No apps available yet' : '';
        return (0, mustache_1.render)(html, {
            slug,
            emptyPlaceholder,
        }, {
            children: (_b = reviewApp.apps) === null || _b === void 0 ? void 0 : _b.map((app, index) => {
                return `
                  <div class="col-sm">
                    ${(0, card_1.Card)(app)}
                  </div>
                  ${index % 4 === 3
                    ? `
                      <div class="w-100"></div>
                    `
                    : ''}
                `;
            }).join('\n'),
        });
    })
        .join('\n');
};
exports.ReviewAppList = ReviewAppList;
