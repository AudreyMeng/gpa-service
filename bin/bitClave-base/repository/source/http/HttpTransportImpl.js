"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
const InterceptorCortege_1 = require("./InterceptorCortege");
let XMLHttpRequest;
if ((typeof window !== 'undefined' && window.XMLHttpRequest)) {
    XMLHttpRequest = window.XMLHttpRequest;
}
else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}
class HttpTransportImpl {
    constructor(host) {
        this.interceptors = [];
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
        return this.acceptInterceptor(new InterceptorCortege_1.InterceptorCortege(path, method, this.headers, data))
            .then((cortege) => new Promise((resolve, reject) => {
            try {
                const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                const request = new XMLHttpRequest();
                request.open(method, url);
                cortege.headers.forEach((value, key) => {
                    request.setRequestHeader(key, value);
                });
                request.onload = () => {
                    const result = new Response_1.Response(request.responseText, request.status);
                    if (request.status >= 200 && request.status < 300) {
                        resolve(result);
                    }
                    else {
                        reject(result);
                    }
                };
                request.onerror = () => {
                    const result = new Response_1.Response(request.responseText, request.status);
                    reject(result);
                };
                request.send(JSON.stringify(cortege.data ? cortege.data : {}));
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    getHost() {
        return this.host;
    }
}
exports.HttpTransportImpl = HttpTransportImpl;
//# sourceMappingURL=HttpTransportImpl.js.map