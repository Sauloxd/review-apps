"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPage = void 0;
const layout_1 = require("./layout");
const body_1 = require("./components/body/body");
const defaultPage = (reviewApps) => {
    const body = (0, body_1.Body)({ reviewApps });
    return (0, layout_1.layout)({ children: body });
};
exports.defaultPage = defaultPage;
