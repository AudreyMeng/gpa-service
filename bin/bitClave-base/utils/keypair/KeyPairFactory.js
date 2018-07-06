"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BitKeyPair_1 = require("./BitKeyPair");
const RpcKeyPair_1 = require("./rpc/RpcKeyPair");
class KeyPairFactory {
    static createDefaultKeyPair(permissionsSource, siteDataSource, origin) {
        return new BitKeyPair_1.BitKeyPair(permissionsSource, siteDataSource, origin);
    }
    static createRpcKeyPair(rpcTransport) {
        return new RpcKeyPair_1.RpcKeyPair(rpcTransport);
    }
}
exports.KeyPairFactory = KeyPairFactory;
//# sourceMappingURL=KeyPairFactory.js.map