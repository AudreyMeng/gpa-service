"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SearchRequest_1 = __importDefault(require("../models/SearchRequest"));
const HttpMethod_1 = require("../source/http/HttpMethod");
class SearchRequestRepositoryImpl {
    constructor(transport) {
        this.SEARCH_REQUEST_API = '/v1/client/{owner}/search/request/{id}';
        this.transport = transport;
    }
    create(owner, searchRequest) {
        return this.transport.sendRequest(this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''), HttpMethod_1.HttpMethod.Post, searchRequest.toJson()).then((response) => SearchRequest_1.default.fromJson(response.json));
    }
    deleteById(owner, id) {
        return this.transport.sendRequest(this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Delete, id).then((response) => parseInt(response.json.toString()));
    }
    getSearchRequestByOwnerAndId(owner, id) {
        return this.transport.sendRequest(this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListSearchRequests(response.json));
    }
    getSearchRequestByOwner(owner) {
        return this.transport.sendRequest(this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''), HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListSearchRequests(response.json));
    }
    getAllSearchRequests() {
        return this.transport.sendRequest(this.SEARCH_REQUEST_API.replace('{owner}', '0x0').replace('{id}', ''), HttpMethod_1.HttpMethod.Get).then((response) => this.jsonToListSearchRequests(response.json));
    }
    jsonToListSearchRequests(json) {
        const result = [];
        for (let item of json) {
            result.push(SearchRequest_1.default.fromJson(item));
        }
        return result;
    }
}
exports.default = SearchRequestRepositoryImpl;
//# sourceMappingURL=SearchRequestRepositoryImpl.js.map