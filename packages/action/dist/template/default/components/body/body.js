"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const mustache_1 = require("mustache");
const to_html_1 = require("../../to-html");
const review_app_list_1 = require("../review-app-list/review-app-list");
const html = (0, to_html_1.toHtml)(__dirname, 'body.html');
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
