"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleAccount_1 = __importDefault(require("./SimpleAccount"));
class Account extends SimpleAccount_1.default {
    constructor(publicKey = '', nonce = 0) {
        super(publicKey, nonce);
        this.message = '';
        this.sig = '';
    }
    toSimpleAccount() {
        return new SimpleAccount_1.default(this.publicKey, this.nonce);
    }
}
exports.default = Account;
//# sourceMappingURL=Account.js.map