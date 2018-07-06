"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpTransportImpl_1 = require("./http/HttpTransportImpl");
const RpcTransportImpl_1 = require("./rpc/RpcTransportImpl");
const HttpTransportSyncedImpl_1 = require("./http/HttpTransportSyncedImpl");
class TransportFactory {
    static createHttpTransport(host) {
        return new HttpTransportSyncedImpl_1.HttpTransportSyncedImpl(host);
    }
    static createJsonRpcHttpTransport(host) {
        return new RpcTransportImpl_1.RpcTransportImpl(new HttpTransportImpl_1.HttpTransportImpl(host));
    }
}
exports.TransportFactory = TransportFactory;
//# sourceMappingURL=TransportFactory.js.map