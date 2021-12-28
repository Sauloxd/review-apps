"use strict";
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
exports.onPullRequestClosed = void 0;
const remove_app_1 = require("../../services/remove-app");
const params_1 = require("./params");
function onPullRequestClosed() {
    return __awaiter(this, void 0, void 0, function* () {
        const params = (0, params_1.getParams)();
        yield (0, remove_app_1.removeApp)(params);
    });
}
exports.onPullRequestClosed = onPullRequestClosed;
