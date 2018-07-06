"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcDecryptMessage extends RpcToken_1.RpcToken {
    constructor(accessToken, senderPk, encrypted) {
        super(accessToken);
        this.senderPk = senderPk;
        this.encrypted = encrypted;
    }
}
exports.default = RpcDecryptMessage;
//# sourceMappingURL=RpcDecryptMessage.js.map