"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcAuth extends RpcToken_1.RpcToken {
    constructor(accessToken = '', passPhrase = '', origin = '', expireDate = '') {
        super(accessToken);
        this.passPhrase = passPhrase;
        this.origin = origin;
        this.expireDate = expireDate;
    }
}
exports.RpcAuth = RpcAuth;
//# sourceMappingURL=RpcAuth.js.map