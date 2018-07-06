"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require('crypto-js');
class CryptoUtils {
    static keccak256(message) {
        const array = CryptoJS.SHA3(message, { outputLength: 256 });
        return array.toString(CryptoJS.enc.Hex);
    }
    static sha384(message) {
        const array = CryptoJS.SHA384(message);
        return array.toString(CryptoJS.enc.Hex);
    }
    static encryptAes256(message, pass) {
        const ciphertext = CryptoJS.AES.encrypt(message, pass, { outputLength: 256 });
        return ciphertext.toString();
    }
    static decryptAes256(ciphertext, pass) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, pass, { outputLength: 256 });
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    static PBKDF2(password, keySize) {
        return CryptoJS.PBKDF2(password, CryptoUtils.sha384(CryptoUtils.sha384(password)), { keySize: keySize / 32, iterations: 100 }).toString(CryptoJS.enc.Hex);
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=CryptoUtils.js.map