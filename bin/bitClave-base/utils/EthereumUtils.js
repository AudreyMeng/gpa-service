"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sigUtil = require('eth-sig-util');
class EthereumUtils {
    static recoverPersonalSignature(data) {
        return sigUtil.recoverPersonalSignature(data);
    }
    static createSig(privateKey, data) {
        return sigUtil.personalSign(Buffer.from(privateKey, 'hex'), data);
    }
}
exports.EthereumUtils = EthereumUtils;
//# sourceMappingURL=EthereumUtils.js.map