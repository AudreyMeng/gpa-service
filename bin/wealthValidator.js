"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importStar(require("./bitClave-base/Base"));
const Permissions_1 = require("./bitClave-base/utils/keypair/Permissions");
const bignumber_js_1 = require("bignumber.js");
const token_1 = __importDefault(require("./token"));
const web3_1 = __importDefault(require("web3"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class WealthValidator {
    constructor() {
        this.cryptoCompareMinAPI = "https://min-api.cryptocompare.com/data/pricemulti?tsyms=ETH&fsyms=";
        this.tokenContracts = new Map();
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider('https://mainnet.infura.io/'));
        // this.base = new Base('https://base2-bitclva-com.herokuapp.com', 'localhost');
        this.base = new Base_1.default('https://base-node-staging.herokuapp.com/', 'localhost');
        this.tokenAddreesesToSymbols = new Map([
            ['EOS', new token_1.default('0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0', 18)],
            ['TRX', new token_1.default('0xf230b790e05390fc8295f4d3f60332c93bed42e2', 6)],
            ['BNB', new token_1.default('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', 18)],
            ['VEN', new token_1.default('0xd850942ef8811f2a866692a623011bde52a462c1', 18)],
            ['OMG', new token_1.default('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', 18)],
            ['ICX', new token_1.default('0xb5a5f22694352c15b00323844ad545abb2b11028', 18)],
            ['BTM', new token_1.default('0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750', 8)],
            ['DGD', new token_1.default('0xe0b7927c4af23765cb51314a0e0521a9645f0e2a', 9)],
            ['PPT', new token_1.default('0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a', 8)],
            ['RHOC', new token_1.default('0x168296bb09e24a88805cb9c33356536b980d3fc5', 8)],
            ['AE', new token_1.default('0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d', 18)],
            ['SNT', new token_1.default('0x744d70fdbe2ba4cf95131626614a1763df805b9e', 18)],
            ['MKR', new token_1.default('0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', 18)],
            ['ZIL', new token_1.default('0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27', 12)],
            ['REP', new token_1.default('0xe94327d07fc17907b4db788e5adf2ed424addff6', 18)],
            ['ZRX', new token_1.default('0xe41d2489571d322189246dafa5ebde1f4699f498', 18)],
            ['IOST', new token_1.default('0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab', 18)],
            ['AION', new token_1.default('0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466', 8)],
            ['LRC', new token_1.default('0xef68e7c694f40c8202821edf525de3782458639f', 18)],
            ['WTC', new token_1.default('0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74', 18)],
            ['CENNZ', new token_1.default('0x1122b6a0e00dce0563082b6e2953f3a943855c1f', 18)],
            ['VERI', new token_1.default('0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374', 18)],
            ['QASH', new token_1.default('0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6', 6)],
            ['BAT', new token_1.default('0x0d8775f648430679a709e98d2b0cb6250d2887ef', 18)],
            ['DRGN', new token_1.default('0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e', 18)],
            ['GNT', new token_1.default('0xa74476443119A942dE498590Fe1f2454d7D4aC0d', 18)],
            ['NAS', new token_1.default('0x5d65D971895Edc438f465c17DB6992698a52318D', 18)],
            ['ETHOS', new token_1.default('0x5af2be193a6abca9c8817001f45744777db30756', 8)],
            ['R', new token_1.default('0x48f775efbe4f5ece6e0df2f7b5932df56823b990', 0)],
            ['FUN', new token_1.default('0x419d0d8bdd9af5e606ae2232ed285aff190e711b', 8)],
        ]);
        const tokenSymbols = Array.from(this.tokenAddreesesToSymbols.keys());
        this.commaSeparatedTokens = tokenSymbols.join(',');
    }
    async workingCycle() {
        console.log('start life-cycle');
        const passPhrase = 'habit ticket uphold favorite rival hole smooth upset stool ahead clog lady';
        const unique = 'unique message for sig';
        const tokenRates = await this._getTokenRates();
        const accValidator = await this.base.accountManager.authenticationByPassPhrase(passPhrase, unique);
        console.log(`Wealth validator has authorized. it public key is "${accValidator.publicKey}"`);
        const requestsByFrom = await this.base.dataRequestManager.getRequests(accValidator.publicKey, '');
        console.log(`requests length is ${requestsByFrom.length}`);
        const wealthMap = await this.base.profileManager.getData();
        // const grantsForClients =  [];
        // let addresses: Array<string>;
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
        // Validator stores the data in <key, value> map, where key is the public key of the user that asked for verification
        await this.base.profileManager.updateData(wealthMap);
        for (let i = 0, max = requestsByFrom.length; i < max; i++) {
            const request = requestsByFrom[i];
            const grantFields = new Map();
            // grantFields.clear();
            grantFields.set(request.toPk, Permissions_1.AccessRight.R);
            // Validator shares wealth records with the original owners of the wallets
            await this.base.dataRequestManager.grantAccessForClient(request.toPk, grantFields);
            console.log('Validator shared wealth records with the original owners of the wallets');
        }
        console.log('finish.');
    }
    async _getEthAddresses(request) {
        const decryptedObj = await this.base.profileManager.getAuthorizedData(request.toPk, request.responseData);
        const wallet = decryptedObj.get(Base_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS);
        // validator verifies the ETH wallets
        var res = Base_1.WalletUtils.validateWallets(Base_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS, JSON.parse(wallet), request.toPk);
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