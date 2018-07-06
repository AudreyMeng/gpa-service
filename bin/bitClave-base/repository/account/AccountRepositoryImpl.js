"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("../source/http/HttpMethod");
const Account_1 = __importDefault(require("../models/Account"));
class AccountRepositoryImpl {
    constructor(transport) {
        this.SIGN_UP = '/v1/registration';
        this.SIGN_IN = '/v1/exist';
        this.DELETE = '/v1/delete';
        this.GET_NONCE = '/v1/nonce/';
        this.transport = transport;
    }
    registration(account) {
        return this.transport
            .sendRequest(this.SIGN_UP, HttpMethod_1.HttpMethod.Post, account.toSimpleAccount())
            .then((response) => Object.assign(new Account_1.default(), response.json));
    }
    checkAccount(account) {
        return this.transport
            .sendRequest(this.SIGN_IN, HttpMethod_1.HttpMethod.Post, account.toSimpleAccount())
            .then((response) => Object.assign(new Account_1.default(), response.json));
    }
    unsubscribe(account) {
        return this.transport
            .sendRequest(this.DELETE, HttpMethod_1.HttpMethod.Delete, account.toSimpleAccount())
            .then((response) => Object.assign(new Account_1.default(), response.json));
    }
    getNonce(account) {
        return this.transport
            .sendRequest(this.GET_NONCE + account.publicKey, HttpMethod_1.HttpMethod.Get)
            .then((response) => parseInt(response.json.toString()));
    }
}
exports.default = AccountRepositoryImpl;
//# sourceMappingURL=AccountRepositoryImpl.js.map