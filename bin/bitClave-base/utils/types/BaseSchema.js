"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require('ajv');
// todo need refactor this class!!!!
class BaseSchema {
    constructor() {
        this.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        this.ajvValidateBaseAddrPair = this.ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateAddr = this.ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateWallets = this.ajv.compile(BaseSchema.EthWallets);
        this.ajvValidateAll = this.ajv.compile(BaseSchema.All);
    }
    validateAddr(s) {
        return this.ajvValidateAddr(s);
    }
    validateWallets(s) {
        return this.ajvValidateWallets(s);
    }
    validateBaseAddrPair(s) {
        return this.ajvValidateBaseAddrPair(s);
    }
    validateAll(s) {
        return this.ajvValidateAll(s);
    }
}
BaseSchema.EthBaseAddrPair = {
    'type': 'object',
    'properties': {
        'baseID': { 'type': 'string' },
        'ethAddr': { 'type': 'string' }
    },
    'required': ['baseID', 'ethAddr'],
    'additionalProperties': false
};
BaseSchema.EthAddrRecord = {
    'type': 'object',
    'properties': {
        'data': { 'type': 'string' },
        'sig': {
            'type': 'string'
        },
    },
    'required': ['data'],
    'additionalProperties': false
};
BaseSchema.EthWallets = {
    'definitions': {
        'eth_address': BaseSchema.EthAddrRecord
    },
    'description': 'list of ETH wallets',
    'type': 'object',
    'properties': {
        'data': {
            'type': 'array',
            'items': { '$ref': '#/definitions/eth_address' },
            'minItems': 1,
            'uniqueItems': true
        },
        'sig': {
            'type': 'string'
        }
    }
};
BaseSchema.All = {
    'title': 'Profile',
    'definitions': {
        'eth_address': BaseSchema.EthAddrRecord,
        'eth_wallets': BaseSchema.EthWallets
    },
    'type': 'object',
    'properties': {
        'baseID': {
            'type': 'string'
        },
        'email': {
            'type': 'string'
        },
        'wealth': {
            'description': 'wealth in USD',
            'type': 'string'
        },
        'eth_wallets': { '$ref': '#/definitions/eth_wallets' },
    },
    'required': ['baseID'],
    'additionalProperties': false
};
exports.BaseSchema = BaseSchema;
//# sourceMappingURL=BaseSchema.js.map