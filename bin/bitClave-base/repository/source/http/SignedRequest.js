"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SignedRequest {
    constructor(data, publicKey, sig, nonce) {
        this.data = data;
        this.pk = publicKey;
        this.sig = sig;
        this.nonce = nonce;
    }
}
exports.default = SignedRequest;
//# sourceMappingURL=SignedRequest.js.map