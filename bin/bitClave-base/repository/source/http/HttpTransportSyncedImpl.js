"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
const InterceptorCortege_1 = require("./InterceptorCortege");
const Transaction_1 = __importDefault(require("./Transaction"));
let XMLHttpRequest;
if ((typeof window !== 'undefined' && window.XMLHttpRequest)) {
    XMLHttpRequest = window.XMLHttpRequest;
}
else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}
class HttpTransportSyncedImpl {
    constructor(host) {
        this.interceptors = [];
        this.transactions = [];
        this.headers = new Map([
            ['Accept', 'application/json'], ['Content-Type', 'application/json']
        ]);
        this.host = host;
    }
    addInterceptor(interceptor) {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }
        return this;
    }
    acceptInterceptor(interceptorCortege, interceptorIndex = 0) {
        return (interceptorIndex >= this.interceptors.length)
            ? Promise.resolve(interceptorCortege)
            : this.interceptors[interceptorIndex]
                .onIntercept(interceptorCortege)
                .then(interceptorCortegeResult => this.acceptInterceptor(interceptorCortegeResult, ++interceptorIndex));
    }
    sendRequest(path, method, data) {
        return new Promise((resolve, reject) => {
            const cortege = new InterceptorCortege_1.InterceptorCortege(path, method, this.headers, data);
            this.transactions.push(new Transaction_1.default(resolve, reject, cortege));
            if (this.transactions.length == 1) {
                this.runTransaction(this.transactions[0]);
            }
        });
    }
    getHost() {
        return this.host;
    }
    runTransaction(transaction) {
        this.acceptInterceptor(transaction.cortege)
            .then((cortege) => new Promise((resolve, reject) => {
            try {
                const cortege = transaction.cortege;
                const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                const request = new XMLHttpRequest();
                request.open(cortege.method, url);
                cortege.headers.forEach((value, key) => {
                    request.setRequestHeader(key, value);
                });
                request.onload = () => {
                    const result = new Response_1.Response(request.responseText, request.status);
                    if (request.status >= 200 && request.status < 300) {
                        resolve();
                        transaction.resolve(result);
                        this.callNextRequest();
                    }
                    else {
                        reject();
                        transaction.reject(result);
                        this.callNextRequest();
                    }
                };
                request.onerror = () => {
                    const result = new Response_1.Response(request.responseText, request.status);
                    reject();
                    transaction.reject(result);
                    this.callNextRequest();
                };
                request.send(JSON.stringify(cortege.data ? cortege.data : {}));
            }
            catch (e) {
                reject();
                transaction.reject(e);
                this.callNextRequest();
            }
        }));
    }
    callNextRequest() {
        this.transactions.shift();
        if (this.transactions.length > 0) {
            this.runTransaction(this.transactions[0]);
        }
    }
}
exports.HttpTransportSyncedImpl = HttpTransportSyncedImpl;
//# sourceMappingURL=HttpTransportSyncedImpl.js.map