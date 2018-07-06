"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcDecryptEncryptFields extends RpcToken_1.RpcToken {
    constructor(accessToken, fields) {
        super(accessToken);
        this.fields = fields;
    }
}
exports.default = RpcDecryptEncryptFields;
//# sourceMappingURL=RpcDecryptEncryptFields.js.map