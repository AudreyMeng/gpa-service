"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcSignMessage extends RpcToken_1.RpcToken {
    constructor(message, accessToken) {
        super(accessToken);
        this.message = message;
    }
}
exports.default = RpcSignMessage;
//# sourceMappingURL=RpcSignMessage.js.map