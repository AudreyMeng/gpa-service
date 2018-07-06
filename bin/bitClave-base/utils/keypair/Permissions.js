"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Permissions {
    constructor(fields = new Map()) {
        this.fields = fields;
    }
}
exports.Permissions = Permissions;
var AccessRight;
(function (AccessRight) {
    AccessRight[AccessRight["R"] = 0] = "R";
    AccessRight[AccessRight["RW"] = 1] = "RW";
})(AccessRight = exports.AccessRight || (exports.AccessRight = {}));
//# sourceMappingURL=Permissions.js.map