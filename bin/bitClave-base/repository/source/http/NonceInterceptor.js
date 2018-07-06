"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SignedRequest_1 = __importDefault(require("./SignedRequest"));
class NonceInterceptor {
    constructor(messageSigner, nonceSource) {
        this.messageSigner = messageSigner;
        this.nonceSource = nonceSource;
    }
    onIntercept(cortege) {
        return !(cortege.data instanceof SignedRequest_1.default) && !cortege.isTransaction()
            ? Promise.resolve(cortege)
            : this.nonceSource.getNonce(this.messageSigner.getPublicKey())
                .then(nonce => {
                cortege.data.nonce = ++nonce;
                return cortege;
            });
    }
}
exports.default = NonceInterceptor;
//# sourceMappingURL=NonceInterceptor.js.map