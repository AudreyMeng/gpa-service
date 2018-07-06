"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("../source/http/HttpMethod");
const Site_1 = require("../models/Site");
class SiteRepositoryImpl {
    constructor(transport) {
        this.GET_SITE_DATA_API = '/v1/site/{origin}';
        this.transport = transport;
    }
    getSiteData(origin) {
        return this.transport.sendRequest(this.GET_SITE_DATA_API.replace('{origin}', origin), HttpMethod_1.HttpMethod.Get).then((response) => Object.assign(new Site_1.Site(), response.json));
    }
}
exports.SiteRepositoryImpl = SiteRepositoryImpl;
//# sourceMappingURL=SiteRepositoryImpl.js.map