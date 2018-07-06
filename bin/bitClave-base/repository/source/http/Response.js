"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(json, status) {
        try {
            this._json = JSON.parse(json);
        }
        catch (e) {
            this._json = json;
        }
        this._status = status;
    }
    get json() {
        return this._json;
    }
    get status() {
        return this._status;
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map