"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RpcToken_1 = require("./RpcToken");
class RpcPermissionsFields extends RpcToken_1.RpcToken {
    constructor(accessToken, recipient, data) {
        super(accessToken);
        this.recipient = recipient;
        this.data = data;
    }
}
exports.default = RpcPermissionsFields;
//# sourceMappingURL=RpcPermissionsFields.js.map