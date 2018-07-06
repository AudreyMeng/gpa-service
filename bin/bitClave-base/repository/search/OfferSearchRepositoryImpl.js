"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OfferSearchResultItem_1 = __importDefault(require("../models/OfferSearchResultItem"));
const OfferSearch_1 = __importDefault(require("../models/OfferSearch"));
const HttpMethod_1 = require("../source/http/HttpMethod");
const Offer_1 = __importDefault(require("../models/Offer"));
class OfferSearchRepositoryImpl {
    constructor(transport) {
        this.OFFER_SEARCH_API = '/v1/client/{clientId}/search/result/{id}';
        this.OFFER_SEARCH_ADD_API = '/dev/client/{clientId}/search/result/';
        this.transport = transport;
    }
    getSearchResult(clientId, searchRequestId) {
        return this.transport.sendRequest(this.OFFER_SEARCH_API.replace('{clientId}', clientId)
            .replace('{id}', '') + `?searchRequestId=${searchRequestId}`, HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListResult(response.json));
    }
    complainToSearchItem(clientId, searchResultId) {
        return this.transport.sendRequest(this.OFFER_SEARCH_API.replace('{clientId}', clientId)
            .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`, HttpMethod_1.HttpMethod.Patch, searchResultId).then((response) => { });
    }
    addResultItem(clientId, offerSearch) {
        return this.transport.sendRequest(this.OFFER_SEARCH_ADD_API.replace('{clientId}', clientId), HttpMethod_1.HttpMethod.Post, offerSearch).then((response) => { });
    }
    async jsonToListResult(json) {
        const result = [];
        for (let item of json) {
            result.push(new OfferSearchResultItem_1.default(Object.assign(new OfferSearch_1.default(), item['offerSearch']), Offer_1.default.fromJson(item['offer'])));
        }
        return result;
    }
}
exports.OfferSearchRepositoryImpl = OfferSearchRepositoryImpl;
//# sourceMappingURL=OfferSearchRepositoryImpl.js.map