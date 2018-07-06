"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonUtils_1 = require("../../utils/JsonUtils");
class SearchRequest {
    constructor(tags = new Map()) {
        this.id = 0;
        this.owner = '0x0';
        this.tags = tags;
    }
    static fromJson(json) {
        const searchRequest = Object.assign(new SearchRequest(), json);
        searchRequest.tags = JsonUtils_1.JsonUtils.jsonToMap(json['tags']);
        return searchRequest;
    }
    toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json['tags'] = JsonUtils_1.JsonUtils.mapToJson(this.tags);
        return json;
    }
}
exports.default = SearchRequest;
//# sourceMappingURL=SearchRequest.js.map