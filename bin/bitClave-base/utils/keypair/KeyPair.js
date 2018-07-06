"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyPair {
    constructor(privateKey, publicKey) {
        this._privateKey = privateKey;
        this._publicKey = publicKey;
    }
    get privateKey() {
        return this._privateKey;
    }
    get publicKey() {
        return this._publicKey;
    }
}
exports.KeyPair = KeyPair;
//# sourceMappingURL=KeyPair.js.map