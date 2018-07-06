"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./types/BaseSchema");
const BaseTypes_1 = require("./types/BaseTypes");
const EthereumUtils_1 = require("./EthereumUtils");
const WalletManagerImpl_1 = require("../manager/WalletManagerImpl");
const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
var WalletVerificationCodes;
(function (WalletVerificationCodes) {
    WalletVerificationCodes[WalletVerificationCodes["RC_OK"] = 0] = "RC_OK";
    WalletVerificationCodes[WalletVerificationCodes["RC_BASEID_MISSMATCH"] = -1] = "RC_BASEID_MISSMATCH";
    WalletVerificationCodes[WalletVerificationCodes["RC_ADDR_NOT_VERIFIED"] = -2] = "RC_ADDR_NOT_VERIFIED";
    WalletVerificationCodes[WalletVerificationCodes["RC_ADDR_WRONG_SIGNATURE"] = -3] = "RC_ADDR_WRONG_SIGNATURE";
    WalletVerificationCodes[WalletVerificationCodes["RC_ADDR_SCHEMA_MISSMATCH"] = -4] = "RC_ADDR_SCHEMA_MISSMATCH";
    WalletVerificationCodes[WalletVerificationCodes["RC_GENERAL_ERROR"] = -100] = "RC_GENERAL_ERROR";
})(WalletVerificationCodes = exports.WalletVerificationCodes || (exports.WalletVerificationCodes = {}));
class WalletVerificationStatus {
    constructor() {
        this.rc = WalletVerificationCodes.RC_OK;
        this.err = '';
        this.details = [];
    }
}
exports.WalletVerificationStatus = WalletVerificationStatus;
class WalletUtils {
    static verifyAddressRecord(record) {
        let signerAddr;
        try {
            if (!this.baseSchema.validateAddr(record)) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }
            if (!this.baseSchema.validateBaseAddrPair(JSON.parse(record.data))) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }
            if (record.sig.length > 0) {
                signerAddr = EthereumUtils_1.EthereumUtils.recoverPersonalSignature(record);
            }
            else {
                return WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }
        }
        catch (err) {
            return WalletVerificationCodes.RC_GENERAL_ERROR;
        }
        return (signerAddr == JSON.parse(record.data).ethAddr)
            ? WalletVerificationCodes.RC_OK
            : WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
    }
    static validateWallets(key, val, baseID) {
        const result = new WalletVerificationStatus();
        if (key != WalletManagerImpl_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + WalletManagerImpl_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS + '"';
            result.rc = WalletVerificationCodes.RC_GENERAL_ERROR;
            return result;
        }
        return this.verifyWalletsRecord(baseID, val);
    }
    static verifyWalletsRecord(baseID, msg) {
        let resultCode;
        const status = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;
        if (!this.baseSchema.validateWallets(msg)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }
        // verify all baseID keys are the same in ETH records
        for (let item of msg.data) {
            const pubKey = JSON.parse(item.data).baseID;
            if (pubKey != baseID) {
                status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);
            }
            else if ((resultCode = this.verifyAddressRecord(item)) != WalletVerificationCodes.RC_OK) {
                status.details.push(resultCode);
            }
            else {
                status.details.push(WalletVerificationCodes.RC_OK);
            }
        }
        // verify signature matches the baseID
        const baseAddr = bitcore.PublicKey.fromString(baseID).toAddress().toString(16);
        let sigCheck = false;
        try {
            if (msg.sig.length > 0) {
                sigCheck = Message(JSON.stringify(msg.data)).verify(baseAddr, msg.sig);
                if (!sigCheck)
                    status.rc = WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
            }
            else {
                status.rc = WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }
        }
        catch (err) {
            status.rc = WalletVerificationCodes.RC_GENERAL_ERROR;
        }
        return status;
    }
    static createEthereumAddersRecord(baseID, ethAddr, ethPrvKey) {
        const record = new BaseTypes_1.AddrRecord(JSON.stringify(new BaseTypes_1.BaseAddrPair(baseID, ethAddr)), '');
        record.sig = EthereumUtils_1.EthereumUtils.createSig(ethPrvKey, record);
        return record;
    }
}
WalletUtils.baseSchema = new BaseSchema_1.BaseSchema();
exports.WalletUtils = WalletUtils;
//# sourceMappingURL=WalletUtils.js.map