"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompareAction_1 = require("./CompareAction");
const JsonUtils_1 = require("../../utils/JsonUtils");
class Offer {
    constructor(description = '', title = '', imageUrl = '', worth = '0', tags = new Map(), compare = new Map(), rules = new Map()) {
        this.id = 0;
        this.owner = '0x0';
        this.description = description;
        this.title = title;
        this.imageUrl = imageUrl;
        this.worth = worth;
        this.tags = tags;
        this.compare = compare;
        this.rules = rules;
    }
    static fromJson(json) {
        const offer = Object.assign(new Offer(), json);
        offer.tags = JsonUtils_1.JsonUtils.jsonToMap(json['tags']);
        offer.compare = JsonUtils_1.JsonUtils.jsonToMap(json['compare']);
        offer.rules = JsonUtils_1.JsonUtils.jsonToMap(json['rules']);
        return offer;
    }
    toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json['tags'] = JsonUtils_1.JsonUtils.mapToJson(this.tags);
        json['compare'] = JsonUtils_1.JsonUtils.mapToJson(this.compare);
        json['rules'] = JsonUtils_1.JsonUtils.mapToJson(this.rules);
        for (let item in json['rules']) {
            if (typeof json['rules'][item] == 'number') {
                json['rules'][item] = CompareAction_1.CompareAction[json['rules'][item]].toString();
            }
        }
        return json;
    }
}
exports.default = Offer;
//# sourceMappingURL=Offer.js.map