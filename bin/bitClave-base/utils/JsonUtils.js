"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonUtils {
    static jsonToMap(json) {
        const map = new Map();
        Object.keys(json).forEach((key) => map.set(key, json[key]));
        return map;
    }
    static mapToJson(map) {
        const result = {};
        map.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
}
exports.JsonUtils = JsonUtils;
//# sourceMappingURL=JsonUtils.js.map