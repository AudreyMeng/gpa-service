"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("../http/HttpMethod");
class RpcTransportImpl {
    constructor(httpTransport) {
        this.id = 0;
        this.transport = httpTransport;
    }
    request(method, arg) {
        this.id++;
        const data = {
            'jsonrpc': '2.0',
            method: method,
            params: [arg],
            id: this.id
        };
        return this.transport.sendRequest('/', HttpMethod_1.HttpMethod.Post, data)
            .then(response => response.json['result']);
    }
    disconnect() {
    }
}
exports.RpcTransportImpl = RpcTransportImpl;
//# sourceMappingURL=RpcTransportImpl.js.map