"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataRequest_1 = __importDefault(require("../models/DataRequest"));
const HttpMethod_1 = require("../source/http/HttpMethod");
const OfferShareData_1 = __importDefault(require("../models/OfferShareData"));
class DataRequestRepositoryImpl {
    constructor(transport) {
        this.DATA_REQUEST = '/v1/data/request/';
        this.GRANT_ACCESS_FOR_CLIENT = '/v1/data/grant/request/';
        this.GRANT_ACCESS_FOR_OFFER = '/v1/data/grant/offer/';
        this.transport = transport;
    }
    requestPermissions(toPk, encryptedRequest) {
        const data = new DataRequest_1.default(toPk, encryptedRequest);
        return this.transport
            .sendRequest(this.DATA_REQUEST, HttpMethod_1.HttpMethod.Post, data).then((response) => parseInt(response.json.toString()));
    }
    grantAccessForClient(fromPk, toPk, encryptedResponse) {
        const data = new DataRequest_1.default(toPk, '');
        data.responseData = encryptedResponse;
        data.fromPk = fromPk;
        return this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_CLIENT, HttpMethod_1.HttpMethod.Post, data).then((response) => parseInt(response.json.toString()));
    }
    getRequests(fromPk, toPk) {
        const params = new Map([
            ['toPk', toPk],
            ['fromPk', fromPk]
        ]);
        const strParams = this.joinParams(params);
        return this.transport
            .sendRequest(this.DATA_REQUEST + `?${strParams}`, HttpMethod_1.HttpMethod.Get).then((response) => Object.assign([], response.json));
    }
    grantAccessForOffer(offerSearchId, clientPk, encryptedClientResponse) {
        const shareData = new OfferShareData_1.default(offerSearchId, encryptedClientResponse);
        return this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_OFFER, HttpMethod_1.HttpMethod.Post, shareData)
            .then(() => {
        });
    }
    joinParams(params) {
        let result = [];
        params.forEach((value, key) => {
            if (!this.isEmpty(value)) {
                result.push(`${key}=${value}`);
            }
        });
        return result.join('&');
    }
    isEmpty(value) {
        return value == null || value == undefined || value.trim().length === 0;
    }
}
exports.default = DataRequestRepositoryImpl;
//# sourceMappingURL=DataRequestRepositoryImpl.js.map