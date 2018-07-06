"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("./HttpMethod");
class InterceptorCortege {
    constructor(path, method, headers, data) {
        this.path = path;
        this.method = method;
        this.headers = headers;
        this.data = data;
    }
    isTransaction() {
        return this.method == HttpMethod_1.HttpMethod.Delete ||
            this.method == HttpMethod_1.HttpMethod.Put ||
            this.method == HttpMethod_1.HttpMethod.Patch ||
            this.method == HttpMethod_1.HttpMethod.Post;
    }
}
exports.InterceptorCortege = InterceptorCortege;
//# sourceMappingURL=InterceptorCortege.js.map