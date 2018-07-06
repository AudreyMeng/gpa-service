"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcCheckSignature extends RpcToken_1.RpcToken {
    constructor(msg = '', sig = '', accessToken = '') {
        super(accessToken);
        this.msg = msg;
        this.sig = sig;
    }
}
exports.default = RpcCheckSignature;
//# sourceMappingURL=RpcCheckSignature.js.map