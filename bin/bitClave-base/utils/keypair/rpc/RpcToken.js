"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RpcToken {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }
    getAccessTokenSig() {
        return this.accessToken.substring(32);
    }
    getClearAccessToken() {
        return this.accessToken.substring(0, 32);
    }
}
exports.RpcToken = RpcToken;
//# sourceMappingURL=RpcToken.js.map