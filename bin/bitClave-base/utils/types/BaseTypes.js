"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseAddrPair {
    constructor(baseID, ethAddr) {
        this.baseID = baseID;
        this.ethAddr = ethAddr;
    }
}
exports.BaseAddrPair = BaseAddrPair;
class AddrRecord {
    constructor(data, sig) {
        this.data = data || '';
        this.sig = sig || '';
    }
}
exports.AddrRecord = AddrRecord;
class WalletsRecords {
    constructor(data, sig) {
        this.data = data;
        this.sig = sig;
    }
}
exports.WalletsRecords = WalletsRecords;
class WealthRecord {
    constructor(wealth, sig) {
        this.wealth = wealth;
        this.sig = sig;
    }
}
exports.WealthRecord = WealthRecord;
class WealthPtr {
    constructor(validator, decryptKey) {
        this.validator = validator || '';
        this.decryptKey = decryptKey || '';
    }
}
exports.WealthPtr = WealthPtr;
class ProfileUser {
}
exports.ProfileUser = ProfileUser;
class ProfileWealthValidator {
}
exports.ProfileWealthValidator = ProfileWealthValidator;
//# sourceMappingURL=BaseTypes.js.map