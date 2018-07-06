"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = __importDefault(require("../repository/models/Account"));
const CryptoUtils_1 = require("../utils/CryptoUtils");
const JsonUtils_1 = require("../utils/JsonUtils");
class ProfileManagerImpl {
    constructor(clientRepository, authAccountBehavior, encrypt, decrypt, signer) {
        this.account = new Account_1.default();
        this.clientDataRepository = clientRepository;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.signer = signer;
    }
    signMessage(data) {
        return this.signer.signMessage(data);
    }
    /**
     * Returns decrypted data of the authorized user.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getData() {
        return this.getRawData(this.account.publicKey)
            .then((rawData) => this.decrypt.decryptFields(rawData));
    }
    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getRawData(anyPublicKey) {
        return this.clientDataRepository.getData(anyPublicKey);
    }
    /**
     * Decrypts accepted personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    async getAuthorizedData(recipientPk, encryptedData) {
        const strDecrypt = await this.decrypt.decryptMessage(recipientPk, encryptedData);
        const jsonDecrypt = JSON.parse(strDecrypt);
        const arrayResponse = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
        const result = new Map();
        const recipientData = await this.getRawData(recipientPk) || new Map();
        arrayResponse.forEach((value, key) => {
            if (recipientData.has(key)) {
                try {
                    const data = recipientData.get(key);
                    const decryptedValue = CryptoUtils_1.CryptoUtils.decryptAes256(data, value.pass);
                    result.set(key, decryptedValue);
                }
                catch (e) {
                    console.log('decryption error: ', key, ' => ', recipientData.get(key), e);
                }
            }
        });
        return result;
    }
    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    async getAuthorizedEncryptionKeys(recipientPk, encryptedData) {
        const strDecrypt = await this.decrypt.decryptMessage(recipientPk, encryptedData);
        const jsonDecrypt = JSON.parse(strDecrypt);
        const arrayResponse = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
        const result = new Map();
        const recipientData = await this.getRawData(recipientPk);
        arrayResponse.forEach((value, key) => {
            if (recipientData.has(key)) {
                result.set(key, value.pass);
            }
        });
        return result;
    }
    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    updateData(data) {
        return this.encrypt.encryptFields(data)
            .then(encrypted => this.clientDataRepository.updateData(this.account.publicKey, encrypted));
    }
    onChangeAccount(account) {
        this.account = account;
    }
}
exports.ProfileManagerImpl = ProfileManagerImpl;
//# sourceMappingURL=ProfileManagerImpl.js.map