"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoUtils_1 = require("../CryptoUtils");
const KeyPair_1 = require("./KeyPair");
const Permissions_1 = require("./Permissions");
const JsonUtils_1 = require("../JsonUtils");
const AcceptedField_1 = require("./AcceptedField");
const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ECIES = require('bitcore-ecies');
const Mnemonic = require('bitcore-mnemonic');
class BitKeyPair {
    constructor(permissionsSource, siteDataSource, origin) {
        this.isConfidential = false;
        this.permissions = new Permissions_1.Permissions();
        this.permissionsSource = permissionsSource;
        this.siteDataSource = siteDataSource;
        this.origin = origin;
    }
    createKeyPair(passPhrase) {
        return new Promise(resolve => {
            const pbkdf2 = CryptoUtils_1.CryptoUtils.PBKDF2(passPhrase, 256);
            const hash = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
            const bn = bitcore.crypto.BN.fromBuffer(hash);
            this.privateKey = new bitcore.PrivateKey(bn);
            this.publicKey = this.privateKey.toPublicKey();
            this.addr = this.privateKey.toAddress();
            const privateKeyHex = this.privateKey.toString(16);
            const publicKeyHex = this.publicKey.toString(16);
            resolve(new KeyPair_1.KeyPair(privateKeyHex, publicKeyHex));
        });
    }
    generateMnemonicPhrase() {
        return new Promise(resolve => {
            const mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
            resolve(mnemonic);
        });
    }
    signMessage(data) {
        return new Promise(resolve => {
            const message = new Message(data);
            resolve(message.sign(this.privateKey));
        });
    }
    checkSig(data, sig) {
        return new Promise(resolve => {
            let result;
            try {
                result = Message(data).verify(this.privateKey.toAddress(), sig);
            }
            catch (e) {
                result = false;
            }
            resolve(result);
        });
    }
    getPublicKey() {
        return this.publicKey.toString(16);
    }
    getAddr() {
        return this.addr.toString(16);
    }
    encryptMessage(recipientPk, message) {
        return new Promise(resolve => {
            const ecies = new ECIES({ noKey: true })
                .privateKey(this.privateKey)
                .publicKey(bitcore.PublicKey.fromString(recipientPk));
            resolve(ecies.encrypt(message)
                .toString('base64'));
        });
    }
    async encryptFields(fields) {
        return this.prepareData(fields, true);
    }
    async encryptPermissionsFields(recipient, data) {
        const resultMap = new Map();
        if (data != null && data.size > 0) {
            let pass;
            await this.syncPermissions();
            for (let [key, value] of data.entries()) {
                if (!this.hasPermissions(key, false)) {
                    continue;
                }
                pass = await this.generatePasswordForField(key.toLowerCase());
                resultMap.set(key, new AcceptedField_1.AcceptedField(pass, value));
            }
        }
        const jsonMap = JsonUtils_1.JsonUtils.mapToJson(resultMap);
        return await this.encryptMessage(recipient, JSON.stringify(jsonMap));
    }
    async decryptMessage(senderPk, encrypted) {
        const ecies = new ECIES({ noKey: true })
            .privateKey(this.privateKey)
            .publicKey(bitcore.PublicKey.fromString(senderPk));
        const result = ecies
            .decrypt(new Buffer(encrypted, 'base64'))
            .toString();
        return result;
    }
    async decryptFields(fields) {
        return this.prepareData(fields, false);
    }
    async prepareData(data, encrypt) {
        const result = new Map();
        let pass;
        let changedValue;
        await this.syncPermissions();
        for (let [key, value] of data.entries()) {
            if (!this.hasPermissions(key, !encrypt)) {
                continue;
            }
            pass = await this.generatePasswordForField(key);
            if (pass != null && pass != undefined && pass.length > 0) {
                changedValue = encrypt
                    ? CryptoUtils_1.CryptoUtils.encryptAes256(value, pass)
                    : CryptoUtils_1.CryptoUtils.decryptAes256(value, pass);
                result.set(key.toLowerCase(), changedValue);
            }
        }
        return result;
    }
    hasPermissions(field, read) {
        if (this.isConfidential) {
            return true;
        }
        const keyPermission = this.permissions.fields.get(field);
        return read
            ? keyPermission === Permissions_1.AccessRight.R || keyPermission === Permissions_1.AccessRight.RW
            : keyPermission === Permissions_1.AccessRight.RW;
    }
    async syncPermissions() {
        if (!this.isConfidential && this.permissions.fields.size === 0) {
            const site = await this.siteDataSource.getSiteData(this.origin);
            this.isConfidential = site.confidential;
            if (!site.confidential) {
                const requests = await this.permissionsSource.getGrandAccessRecords(site.publicKey, this.getPublicKey());
                for (let request of requests) {
                    const strDecrypt = await this.decryptMessage(site.publicKey, request.responseData);
                    const jsonDecrypt = JSON.parse(strDecrypt);
                    const resultMap = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
                    this.permissions.fields.clear();
                    let self = this;
                    resultMap.forEach((value, key) => {
                        self.permissions.fields.set(key, value.access);
                    });
                }
            }
        }
    }
    generatePasswordForField(fieldName) {
        return new Promise(resolve => {
            const result = CryptoUtils_1.CryptoUtils.PBKDF2(CryptoUtils_1.CryptoUtils.keccak256(this.privateKey.toString(16)) + fieldName.toLowerCase(), 384);
            resolve(result);
        });
    }
}
exports.BitKeyPair = BitKeyPair;
//# sourceMappingURL=BitKeyPair.js.map