"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RpcAccessData_1 = __importDefault(require("./RpcAccessData"));
const Permissions_1 = require("../Permissions");
class ClientData extends RpcAccessData_1.default {
    constructor(publicKey = '', accessToken = '', origin = '', expireDate = '', permissions = new Permissions_1.Permissions()) {
        super(accessToken, origin, expireDate, permissions);
        this.publicKey = publicKey;
    }
}
exports.default = ClientData;
//# sourceMappingURL=RpcClientData.js.map