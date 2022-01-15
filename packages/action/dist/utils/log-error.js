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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.withError = void 0;
const core = __importStar(require("@actions/core"));
// export const withError =
//   <P, R>(
//     cb: (...params: P[]) => Promise<R>
//   ): ((...params: P[]) => Promise<R>) =>
//   async (...args) => {
//     core.debug(`CALL ${cb.name}`);
//     core.debug(`WITH ${JSON.stringify(args, null, 2)}`);
//     try {
//       return await cb(...args);
//     } catch (e) {
//       core.setFailed(`FAILED ${cb.name}`);
//       core.debug((e as any).message as string);
//       throw e;
//     }
//   };
function withError(cb) {
    // Return a new function that tracks how long the original took
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        core.debug(`CALL ${cb.name}`);
        core.debug(`WITH ${JSON.stringify(args, null, 2)}`);
        try {
            return yield cb(...args);
        }
        catch (e) {
            core.setFailed(`FAILED ${cb.name}`);
            core.debug(e.message);
            throw e;
        }
    });
}
exports.withError = withError;
