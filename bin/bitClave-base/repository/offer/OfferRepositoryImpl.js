"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Offer_1 = __importDefault(require("../models/Offer"));
const HttpMethod_1 = require("../source/http/HttpMethod");
class OfferRepositoryImpl {
    constructor(transport) {
        this.OFFER_API = '/v1/client/{owner}/offer/{id}';
        this.transport = transport;
    }
    create(owner, offer) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', ''), HttpMethod_1.HttpMethod.Put, offer.toJson()).then((response) => Offer_1.default.fromJson(response.json));
    }
    update(owner, id, offer) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Put, offer.toJson()).then((response) => Offer_1.default.fromJson(response.json));
    }
    deleteById(owner, id) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Delete, id).then((response) => parseInt(response.json.toString()));
    }
    getOfferByOwnerAndId(owner, id) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListOffers(response.json));
    }
    getOfferByOwner(owner) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', ''), HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListOffers(response.json));
    }
    getAllOffer() {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', '0x0').replace('{id}', ''), HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListOffers(response.json));
    }
    jsonToListOffers(json) {
        const result = [];
        for (let item of json) {
            result.push(Offer_1.default.fromJson(item));
        }
        return result;
    }
}
exports.default = OfferRepositoryImpl;
//# sourceMappingURL=OfferRepositoryImpl.js.map