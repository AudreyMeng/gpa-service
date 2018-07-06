"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcFieldPassword extends RpcToken_1.RpcToken {
    constructor(accessToken, fieldName) {
        super(accessToken);
        this.fieldName = fieldName;
    }
}
exports.default = RpcFieldPassword;
//# sourceMappingURL=RpcFieldPassword.js.map