"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Permissions_1 = require("../Permissions");
const RpcToken_1 = require("./RpcToken");
class AccessData extends RpcToken_1.RpcToken {
    constructor(accessToken = '', origin = '', expireDate = '', permissions = new Permissions_1.Permissions()) {
        super(accessToken);
        this.origin = origin;
        this.expireDate = expireDate;
        this.permissions = permissions;
    }
}
exports.default = AccessData;
//# sourceMappingURL=RpcAccessData.js.map