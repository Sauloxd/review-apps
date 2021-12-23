"use strict";
exports.__esModule = true;
exports.indexPage = void 0;
var indexPage = function (reviewApps) { return "\n<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <title>Review apps</title>\n    <meta name=\"description\" content=\"QA every PR effortlessly\">\n    <link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css\" integrity=\"sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z\" crossorigin=\"anonymous\">\n    <style>\n      body { font-family: Roboto; }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col-sm\">\n          <h1 style=\"margin-top: 30px; margin-bottom: 15px;\">\n            Static review apps collection\n          </h1>\n        </div>\n      </div>\n      ".concat(Object.keys(reviewApps).length === 0 ? 'No apps available yet' : '', "\n      ").concat(Object.entries(reviewApps)
    .map(function (_a) {
    var _b, _c;
    var name = _a[0], reviewApp = _a[1];
    return "\n            <div class=\"row\">\n              <div class=\"col-sm\">\n                <h2 style=\"margin-top: 30px;\">\n                  ".concat(name, "\n                </h2>\n              </div>\n            </div>\n            <div class=\"row\">\n              ").concat(((_b = reviewApp.apps) === null || _b === void 0 ? void 0 : _b.length) === 0 ? 'No apps available yet' : '', "\n              ").concat((_c = reviewApp.apps) === null || _c === void 0 ? void 0 : _c.map(function (app, index) {
        return "\n                  <div class=\"col-sm\">\n                    ".concat(Card(app), "\n                  </div>\n                  ").concat(index % 4 === 3
            ? "\n                     <div class=\"w-100\"></div>\n                   "
            : '', "\n                ");
    }).join('\n'), "\n            </div>\n          ");
})
    .join('\n'), "\n    </div>\n  </body>\n</html>\n"); };
exports.indexPage = indexPage;
function Card(app) {
    var name = app.name, headCommit = app.headCommit, updatedAt = app.updatedAt, href = app.href, pullRequestUrl = app.pullRequestUrl;
    return "\n    <div class=\"card\" style=\"width: 18rem;\">\n      <div class=\"card-body\">\n        <h5 class=\"card-title\">".concat(name, "</h5>\n        <h6 class=\"card-subtitle mb-2 text-muted\">#").concat(headCommit.slice(0, 12), "</h6>\n        <h6 class=\"card-subtitle mb-2 text-muted\">").concat(updatedAt.toLocaleString(), "</h6>\n        <a href=\"").concat(href, "\" class=\"card-link\">App</a>\n        ").concat(pullRequestUrl
        ? "<a href=\"".concat(pullRequestUrl, "\" class=\"card-link\">Pull Request</a>")
        : '', "\n      </div>\n    </div>\n  ");
}
