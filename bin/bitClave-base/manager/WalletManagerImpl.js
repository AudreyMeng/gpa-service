"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTypes_1 = require("../utils/types/BaseTypes");
const Account_1 = __importDefault(require("../repository/models/Account"));
const WalletUtils_1 = require("../utils/WalletUtils");
const Permissions_1 = require("../utils/keypair/Permissions");
class WalletManagerImpl {
    constructor(profileManager, dataRequestManager, baseSchema, messageSigner, authAccountBehavior) {
        this.account = new Account_1.default();
        this.profileManager = profileManager;
        this.dataRequestManager = dataRequestManager;
        this.baseSchema = baseSchema;
        this.messageSigner = messageSigner;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    async createWalletsRecords(wallets, baseID) {
        for (let msg of wallets) {
            if ((WalletUtils_1.WalletUtils.verifyAddressRecord(msg) != WalletUtils_1.WalletVerificationCodes.RC_OK) &&
                (WalletUtils_1.WalletUtils.verifyAddressRecord(msg) != WalletUtils_1.WalletVerificationCodes.RC_ADDR_NOT_VERIFIED)) {
                throw 'invalid eth record: ' + msg;
            }
            if (baseID != JSON.parse(msg.data).baseID) {
                throw 'baseID missmatch';
            }
        }
        const msgWallets = new BaseTypes_1.WalletsRecords(wallets, '');
        if (!this.baseSchema.validateWallets(msgWallets)) {
            throw 'invalid wallets structure';
        }
        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)
        // BASE Style signing
        msgWallets.sig = await this.messageSigner.signMessage(JSON.stringify(msgWallets.data));
        return msgWallets;
    }
    async addWealthValidator(validatorPbKey) {
        // Alice adds wealth record pointing to Validator's
        const myData = await this.profileManager.getData();
        myData.set(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR, validatorPbKey);
        await this.profileManager.updateData(myData);
        const acceptedFields = new Map();
        acceptedFields.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, Permissions_1.AccessRight.RW);
        await this.dataRequestManager.grantAccessForClient(validatorPbKey, acceptedFields);
    }
    async refreshWealthPtr() {
        const data = await this.profileManager.getData();
        let wealthPtr;
        if (data.has(WalletManagerImpl.DATA_KEY_WEALTH)) {
            const wealth = data.get(WalletManagerImpl.DATA_KEY_WEALTH) || '';
            wealthPtr = Object.assign(new BaseTypes_1.WealthPtr(), JSON.parse(wealth));
        }
        else if (data.has(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR)) {
            const validatorPbKey = data.get(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR) || '';
            // Alice reads the wealth record that Validator shared
            const recordsFromValidator = await this.dataRequestManager.getRequests(this.account.publicKey, validatorPbKey);
            // if validator already did one validation
            if (recordsFromValidator.length > 0) {
                // Alice gets the decryption keys for all records that Validator shared
                const decryptionKeys = await this.profileManager.getAuthorizedEncryptionKeys(validatorPbKey, recordsFromValidator[0].responseData);
                // get decryption key for "wealth" record
                const wealthDecKey = decryptionKeys.get(this.account.publicKey) || '';
                // Alice adds wealth record pointing to Validator's storage
                wealthPtr = new BaseTypes_1.WealthPtr(validatorPbKey, wealthDecKey);
                data.set(WalletManagerImpl.DATA_KEY_WEALTH, JSON.stringify(wealthPtr));
                await this.profileManager.updateData(data);
            }
            else {
                throw 'validator did not verify anything yet';
            }
        }
        else {
            throw WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR + ' data not exist!';
        }
        return wealthPtr;
    }
    onChangeAccount(account) {
        this.account = account;
    }
}
WalletManagerImpl.DATA_KEY_ETH_WALLETS = 'eth_wallets';
WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR = 'ethwealthvalidator';
WalletManagerImpl.DATA_KEY_WEALTH = 'wealth';
exports.WalletManagerImpl = WalletManagerImpl;
//# sourceMappingURL=WalletManagerImpl.js.map