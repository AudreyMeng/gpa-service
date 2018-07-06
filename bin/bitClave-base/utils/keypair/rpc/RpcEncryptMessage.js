"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcEncryptMessage extends RpcToken_1.RpcToken {
    constructor(accessToken, recipientPk, message) {
        super(accessToken);
        this.recipientPk = recipientPk;
        this.message = message;
    }
}
exports.default = RpcEncryptMessage;
//# sourceMappingURL=RpcEncryptMessage.js.map