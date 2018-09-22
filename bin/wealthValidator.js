"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const bignumber_js_1 = require("bignumber.js");
const bitclave_base_1 = __importStar(require("bitclave-base/"));
const token_1 = __importDefault(require("./token"));
const config = require('config');
class WealthValidator {
    constructor() {
        this.cryptoCompareMinAPI = config.api.cryptocompare;
        this.tokenContracts = new Map();
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config.api.web3));
        this.base = new bitclave_base_1.default(config.api.base, config.siteOrigin);
        this.tokenAddreesesToSymbols = new Map();
        config.tokens.forEach((e) => this.tokenAddreesesToSymbols.set(e.name, new token_1.default(e.addr, e.num)));
        const tokenSymbols = Array.from(this.tokenAddreesesToSymbols.keys());
        this.commaSeparatedTokens = tokenSymbols.join(',');
    }
    async workingCycle() {
        console.log('start life-cycle');
        const tokenRates = await this._getTokenRates();
        const accValidator = await this.base.accountManager.authenticationByPassPhrase(config.pass, config.unique);
        console.log(`Wealth validator has authorized. it public key is "${accValidator.publicKey}"`);
        const requestsByFrom = await this.base.dataRequestManager.getRequests(accValidator.publicKey, '');
        console.log(`requests length is ${requestsByFrom.length}`);
        const wealthMap = await this.base.profileManager.getData();
        for (let i = 0, max = requestsByFrom.length; i < max; i++) {
            const request = requestsByFrom[i];
            const addresses = await this._getEthAddresses(request);
            if (addresses.length > 0) {
                const wealth = await this._calculateWealthByAddresses(addresses, this.tokenContracts, this.tokenAddreesesToSymbols, tokenRates);
                wealthMap.set(request.toPk, JSON.stringify({
                    'wealth': wealth,
                    'sig': await this.base.profileManager.signMessage(wealth),
                }));
            }
        }
        // Validator writes wealth for all users to BASE
        // Validator stores the data in <key, value> map,
        // where key is the public key of the user that asked for verification
        await this.base.profileManager.updateData(wealthMap);
        for (let i = 0, max = requestsByFrom.length; i < max; i++) {
            const request = requestsByFrom[i];
            const grantFields = new Map();
            // grantFields.clear();
            grantFields.set(request.toPk, 0); // Read,
            // Validator shares wealth records with the original owners of the wallets
            await this.base.dataRequestManager.grantAccessForClient(request.toPk, grantFields);
            console.log('Validator shared wealth records with the original owners of the wallets');
        }
        console.log('finish.');
    }
    async _getEthAddresses(request) {
        const decryptedObj = await this.base.profileManager.getAuthorizedData(request.toPk, request.responseData);
        const wallet = decryptedObj.get(bitclave_base_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS);
        // validator verifies the ETH wallets
        var res = bitclave_base_1.WalletUtils.validateWallets(bitclave_base_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS, JSON.parse(wallet), request.toPk);
        const result = [];
        if (res.rc == 0 && res.err == '') {
            const addresses = JSON.parse(wallet).data.map((d) => JSON.parse(d.data).ethAddr);
            for (let address of addresses) {
                result.push(address);
            }
        }
        return result;
    }
    async _calculateWealthByAddresses(addresses, tokenContracts, tokenAddreesesToSymbols, tokenRates) {
        let valuesOnAddress = new Map();
        let wealth = new bignumber_js_1.BigNumber(0);
        try {
            for (let address of addresses) {
                valuesOnAddress = await this._getValueOfTokensByAddress(address, tokenContracts, tokenAddreesesToSymbols);
                wealth = wealth.plus(this._calculateWealth(valuesOnAddress, tokenRates));
            }
        }
        catch (e) {
            console.log(e);
        }
        return wealth.toString();
    }
    async _getValueOfTokensByAddress(address, tokenContracts, tokens) {
        const result = new Map();
        const prepareDec = new bignumber_js_1.BigNumber(10);
        let value;
        let decimals;
        let valueResult;
        for (let [key, contract] of tokenContracts.entries()) {
            try {
                decimals = prepareDec.pow(tokens.get(key).decimals);
                value = await contract.methods.balanceOf(address).call();
                valueResult = new bignumber_js_1.BigNumber(value).div(decimals);
                result.set(key, valueResult);
            }
            catch (e) {
                console.log('error on calculate:', key, e);
            }
        }
        try {
            const weiBalance = await this.web3.eth.getBalance(address);
            const ethBalance = this.web3.utils.fromWei(weiBalance);
            value = new bignumber_js_1.BigNumber(ethBalance);
            result.set('ETH', value);
        }
        catch (e) {
            console.log('getValueOfTokensByAddress eth:', e);
        }
        return result;
    }
    async _getTokenRates() {
        console.log('Fetching tokens prices to ETH from ' + this.cryptoCompareMinAPI + this.commaSeparatedTokens);
        const tokenRatesObj = await (await node_fetch_1.default(this.cryptoCompareMinAPI + this.commaSeparatedTokens)).json();
        const result = new Map();
        let ethVal;
        let ethBigN;
        for (let name in tokenRatesObj) {
            if (tokenRatesObj.hasOwnProperty(name) && tokenRatesObj[name].hasOwnProperty('ETH')) {
                ethVal = tokenRatesObj[name]['ETH'];
                ethBigN = new bignumber_js_1.BigNumber(ethVal);
                result.set(name, ethBigN);
            }
            else {
                console.log('wrong data of token', name);
            }
        }
        if (result.size != this.tokenAddreesesToSymbols.size) {
            console.log('Can\'t fetch all token prices, only ' + result.size + ' of ' +
                this.tokenAddreesesToSymbols.size);
        }
        else {
            console.log('All token prices fetched');
        }
        return result;
    }
    _calculateWealth(balances, symbolRates) {
        let wealth = new bignumber_js_1.BigNumber(0);
        let rate;
        for (let [key, balance] of balances.entries()) {
            try {
                if (symbolRates.has(key) && balance.gt(0)) {
                    rate = symbolRates.get(key);
                    wealth = wealth.plus(balance.multipliedBy(rate));
                }
            }
            catch (e) {
                console.log('calculateWealth', e);
            }
        }
        if (balances.has('ETH')) {
            wealth = wealth.plus(balances.get('ETH'));
        }
        return wealth;
    }
}
exports.WealthValidator = WealthValidator;
exports.default = WealthValidator;
//# sourceMappingURL=wealthValidator.js.map