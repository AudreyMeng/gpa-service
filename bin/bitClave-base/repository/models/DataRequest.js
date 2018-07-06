"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataRequest {
    constructor(toPk = '', requestData = '', responseData = '') {
        this.id = 0;
        this.fromPk = '';
        this.toPk = '';
        this.requestData = '';
        this.responseData = '';
        this.toPk = toPk;
        this.requestData = requestData;
        this.responseData = responseData;
    }
}
exports.default = DataRequest;
//# sourceMappingURL=DataRequest.js.map