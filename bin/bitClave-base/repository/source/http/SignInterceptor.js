"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SignedRequest_1 = __importDefault(require("./SignedRequest"));
class SignInterceptor {
    constructor(messageSigner) {
        this.messageSigner = messageSigner;
    }
    onIntercept(cortege) {
        return (cortege.data === null || cortege.data == undefined)
            ? Promise.resolve(cortege)
            : this.messageSigner.signMessage(JSON.stringify(cortege.data))
                .then(sigResult => new Promise(resolve => {
                cortege.data = new SignedRequest_1.default(cortege.data, this.messageSigner.getPublicKey(), sigResult, 0);
                resolve(cortege);
            }));
    }
}
exports.default = SignInterceptor;
//# sourceMappingURL=SignInterceptor.js.map