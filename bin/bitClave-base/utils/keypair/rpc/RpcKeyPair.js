"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RpcClientData_1 = __importDefault(require("./RpcClientData"));
const KeyPair_1 = require("../KeyPair");
const RpcSignMessage_1 = __importDefault(require("./RpcSignMessage"));
const RpcEncryptMessage_1 = __importDefault(require("./RpcEncryptMessage"));
const RpcDecryptMessage_1 = __importDefault(require("./RpcDecryptMessage"));
const RpcCheckSignature_1 = __importDefault(require("./RpcCheckSignature"));
const RpcToken_1 = require("./RpcToken");
const RpcDecryptEncryptFields_1 = __importDefault(require("./RpcDecryptEncryptFields"));
const RpcPermissionsFields_1 = __importDefault(require("./RpcPermissionsFields"));
const JsonUtils_1 = require("../../JsonUtils");
const Mnemonic = require('bitcore-mnemonic');
class RpcKeyPair {
    constructor(rpcTransport) {
        this.accessToken = '';
        this.rpcTransport = rpcTransport;
    }
    createKeyPair(passPhrase) {
        return this.rpcTransport.request('checkAccessToken', new RpcToken_1.RpcToken(this.accessToken))
            .then((response) => this.clientData = Object.assign(new RpcClientData_1.default(), response))
            .then((response) => new KeyPair_1.KeyPair('', response.publicKey));
    }
    ;
    generateMnemonicPhrase() {
        return new Promise(resolve => {
            const mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
            resolve(mnemonic);
        });
    }
    signMessage(data) {
        return this.rpcTransport.request('signMessage', new RpcSignMessage_1.default(data, this.clientData.accessToken));
    }
    checkSig(data, sig) {
        return this.rpcTransport.request('checkSig', new RpcCheckSignature_1.default(data, sig, this.clientData.accessToken));
    }
    getPublicKey() {
        return this.clientData.publicKey;
    }
    encryptMessage(recipientPk, message) {
        return this.rpcTransport.request('encryptMessage', new RpcEncryptMessage_1.default(this.clientData.accessToken, recipientPk, message));
    }
    encryptFields(fields) {
        return this.rpcTransport.request('encryptFields', new RpcDecryptEncryptFields_1.default(this.clientData.accessToken, JsonUtils_1.JsonUtils.mapToJson(fields))).then((response) => JsonUtils_1.JsonUtils.jsonToMap(response));
    }
    encryptPermissionsFields(recipient, data) {
        return this.rpcTransport.request('encryptPermissionsFields', new RpcPermissionsFields_1.default(this.clientData.accessToken, recipient, JsonUtils_1.JsonUtils.mapToJson(data)));
    }
    decryptMessage(senderPk, encrypted) {
        return this.rpcTransport.request('decryptMessage', new RpcDecryptMessage_1.default(this.clientData.accessToken, senderPk, encrypted));
    }
    decryptFields(fields) {
        return this.rpcTransport.request('decryptFields', new RpcDecryptEncryptFields_1.default(this.clientData.accessToken, JsonUtils_1.JsonUtils.mapToJson(fields))).then((response) => JsonUtils_1.JsonUtils.jsonToMap(response));
    }
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }
    getAccessToken() {
        return this.accessToken;
    }
}
exports.RpcKeyPair = RpcKeyPair;
//# sourceMappingURL=RpcKeyPair.js.map