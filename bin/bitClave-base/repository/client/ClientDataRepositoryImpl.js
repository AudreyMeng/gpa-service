"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("../source/http/HttpMethod");
const JsonUtils_1 = require("../../utils/JsonUtils");
class ClientDataRepositoryImpl {
    constructor(transport) {
        this.CLIENT_GET_DATA = '/v1/client/{pk}/';
        this.CLIENT_SET_DATA = '/v1/client/';
        this.transport = transport;
    }
    getData(pk) {
        return this.transport
            .sendRequest(this.CLIENT_GET_DATA.replace('{pk}', pk), HttpMethod_1.HttpMethod.Get)
            .then((response) => JsonUtils_1.JsonUtils.jsonToMap(response.json));
    }
    updateData(pk, data) {
        return this.transport
            .sendRequest(this.CLIENT_SET_DATA, HttpMethod_1.HttpMethod.Patch, JsonUtils_1.JsonUtils.mapToJson(data))
            .then((response) => JsonUtils_1.JsonUtils.jsonToMap(response.json));
    }
}
exports.default = ClientDataRepositoryImpl;
//# sourceMappingURL=ClientDataRepositoryImpl.js.map