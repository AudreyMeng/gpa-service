"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = __importDefault(require("../repository/models/Account"));
const RpcKeyPair_1 = require("../utils/keypair/rpc/RpcKeyPair");
class AccountManagerImpl {
    constructor(auth, keyPairCreator, messageSigner, authAccountBehavior) {
        this.accountRepository = auth;
        this.keyPairCreator = keyPairCreator;
        this.messageSigner = messageSigner;
        this.authAccountBehavior = authAccountBehavior;
    }
    /**
     * Checks or Register user with provided mnemonic phrase is already registered in the system.
     * @param {string} passPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    authenticationByPassPhrase(passPhrase, message) {
        this.checkSigMessage(message);
        if (!(this.keyPairCreator instanceof RpcKeyPair_1.RpcKeyPair)) {
            return this.checkAccount(passPhrase, message)
                .catch(reason => this.registration(passPhrase, message));
        }
        throw 'key pair helper does not support pass-phrase authentication';
    }
    /**
     * Checks if user with provided access token is already registered in the system.
     * @param {string} accessToken token for authenticate on remote signer
     * (if {@link KeyPairHelper} support {@link RemoteSigner})
     *
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    authenticationByAccessToken(accessToken, message) {
        this.checkSigMessage(message);
        if (this.keyPairCreator instanceof RpcKeyPair_1.RpcKeyPair) {
            this.keyPairCreator.setAccessToken(accessToken);
            return this.keyPairCreator.createKeyPair('')
                .then(this.generateAccount)
                .then(account => this.accountRepository.checkAccount(account))
                .then(account => this.onGetAccount(account, message));
        }
        throw 'key pair helper does not support token authentication';
    }
    /**
     * Registers a new user in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} after successful registration or http exception if fail.
     */
    registration(mnemonicPhrase, message) {
        this.checkSigMessage(message);
        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then((account) => this.accountRepository.registration(account))
            .then(account => this.onGetAccount(account, message));
    }
    /**
     * Checks if user with provided mnemonic phrase is already registered in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    checkAccount(mnemonicPhrase, message) {
        this.checkSigMessage(message);
        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then(account => this.syncAccount(account, message));
    }
    /**
     * Allows user to unsubscribe from BASE. Delets all his data
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    unsubscribe() {
        return this.accountRepository.unsubscribe(this.authAccountBehavior.getValue());
    }
    getNewMnemonic() {
        return this.keyPairCreator.generateMnemonicPhrase();
    }
    getAccount() {
        return this.authAccountBehavior.getValue();
    }
    checkSigMessage(message) {
        if (message == null || message == undefined || message.length < 10) {
            throw 'message for signature should be have min 10 symbols';
        }
    }
    syncAccount(account, message) {
        return this.accountRepository.checkAccount(account)
            .then(account => this.onGetAccount(account, message));
    }
    generateAccount(keyPair) {
        return new Promise((resolve) => {
            resolve(new Account_1.default(keyPair.publicKey));
        });
    }
    onGetAccount(account, message) {
        return this.messageSigner.signMessage(message)
            .then(sig => new Promise(resolve => {
            account.message = message;
            account.sig = sig;
            this.authAccountBehavior.next(account);
            resolve(account);
        }));
    }
}
exports.AccountManagerImpl = AccountManagerImpl;
//# sourceMappingURL=AccountManagerImpl.js.map