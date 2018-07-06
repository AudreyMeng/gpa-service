import Base, { WalletUtils, WalletManagerImpl, WalletVerificationStatus } from './bitClave-base/Base'
import { AccessRight } from './bitClave-base/utils/keypair/Permissions';

import DataRequest from './bitclave-base/repository/models/DataRequest';
import { BigNumber } from 'bignumber.js'
import Token from './token'
import Web3 from 'web3'
import fetch from 'node-fetch'

export class WealthValidator {
    private commaSeparatedTokens: string;
    private cryptoCompareMinAPI = "https://min-api.cryptocompare.com/data/pricemulti?tsyms=ETH&fsyms=";
    private tokenContracts: Map<string, any> = new Map()
    private tokenAddreesesToSymbols: Map<string, Token>
    private web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'));

    base: Base;
    constructor(){
        // this.base = new Base('https://base2-bitclva-com.herokuapp.com', 'localhost');
        this.base = new Base('https://base-node-staging.herokuapp.com/', 'localhost');
        this.tokenAddreesesToSymbols = new Map([
            ['EOS', new Token('0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0', 18)],
            ['TRX', new Token('0xf230b790e05390fc8295f4d3f60332c93bed42e2', 6)],
            ['BNB', new Token('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', 18)],
            ['VEN', new Token('0xd850942ef8811f2a866692a623011bde52a462c1', 18)],
            ['OMG', new Token('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', 18)],
            ['ICX', new Token('0xb5a5f22694352c15b00323844ad545abb2b11028', 18)],
            ['BTM', new Token('0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750', 8)],
            ['DGD', new Token('0xe0b7927c4af23765cb51314a0e0521a9645f0e2a', 9)],
            ['PPT', new Token('0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a', 8)],
            ['RHOC', new Token('0x168296bb09e24a88805cb9c33356536b980d3fc5', 8)],
            ['AE', new Token('0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d', 18)],
            ['SNT', new Token('0x744d70fdbe2ba4cf95131626614a1763df805b9e', 18)],
            ['MKR', new Token('0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', 18)],
            ['ZIL', new Token('0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27', 12)],
            ['REP', new Token('0xe94327d07fc17907b4db788e5adf2ed424addff6', 18)],
            ['ZRX', new Token('0xe41d2489571d322189246dafa5ebde1f4699f498', 18)],
            ['IOST', new Token('0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab', 18)],
            ['AION', new Token('0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466', 8)],
            ['LRC', new Token('0xef68e7c694f40c8202821edf525de3782458639f', 18)],
            ['WTC', new Token('0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74', 18)],
            ['CENNZ', new Token('0x1122b6a0e00dce0563082b6e2953f3a943855c1f', 18)],
            ['VERI', new Token('0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374', 18)],
            ['QASH', new Token('0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6', 6)],
            ['BAT', new Token('0x0d8775f648430679a709e98d2b0cb6250d2887ef', 18)],
            ['DRGN', new Token('0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e', 18)],
            ['GNT', new Token('0xa74476443119A942dE498590Fe1f2454d7D4aC0d', 18)],
            ['NAS', new Token('0x5d65D971895Edc438f465c17DB6992698a52318D', 18)],
            ['ETHOS', new Token('0x5af2be193a6abca9c8817001f45744777db30756', 8)],
            ['R', new Token('0x48f775efbe4f5ece6e0df2f7b5932df56823b990', 0)],
            ['FUN', new Token('0x419d0d8bdd9af5e606ae2232ed285aff190e711b', 8)],
        ]);
        const tokenSymbols: Array<string> = Array.from(this.tokenAddreesesToSymbols.keys());
        this.commaSeparatedTokens = tokenSymbols.join(',');
    }
    public async workingCycle(){

        console.log('start life-cycle');

        const passPhrase = 'habit ticket uphold favorite rival hole smooth upset stool ahead clog lady';
        const unique = 'unique message for sig';
        const tokenRates: Map<string, any> = await this._getTokenRates();

        const accValidator = await this.base.accountManager.authenticationByPassPhrase(passPhrase, unique);
        console.log(`Wealth validator has authorized. it public key is "${accValidator.publicKey}"`);

        const requestsByFrom: Array<DataRequest> = await this.base.dataRequestManager.getRequests( accValidator.publicKey, '');
        console.log(`requests length is ${requestsByFrom.length}`);

        const wealthMap: Map<string, string> = await this.base.profileManager.getData();

        // const grantsForClients =  [];
        // let addresses: Array<string>;

        for(let i=0, max = requestsByFrom.length; i< max; i++) {

            const request = requestsByFrom[i];

            const addresses = await this._getEthAddresses(request);

            if (addresses.length > 0) {
                const wealth: string = await this._calculateWealthByAddresses(
                    addresses,
                    this.tokenContracts,
                    this.tokenAddreesesToSymbols,
                    tokenRates
                );
                wealthMap.set(request.toPk, JSON.stringify({
                    'wealth': wealth,
                    'sig': await this.base.profileManager.signMessage(wealth),
                }));
            }
        }
        // Validator writes wealth for all users to BASE
        // Validator stores the data in <key, value> map, where key is the public key of the user that asked for verification
        await this.base.profileManager.updateData(wealthMap);


        for(let i=0, max = requestsByFrom.length; i< max; i++) {
            const request = requestsByFrom[i];
            const grantFields: Map<string, AccessRight> = new Map();
            // grantFields.clear();
            grantFields.set(request.toPk, AccessRight.R);

            // Validator shares wealth records with the original owners of the wallets
            await this.base.dataRequestManager.grantAccessForClient(request.toPk, grantFields);
            console.log('Validator shared wealth records with the original owners of the wallets')
        }
        console.log('finish.');
    }

    private async _getEthAddresses(request: DataRequest) {
        const decryptedObj: any = await this.base.profileManager.getAuthorizedData(
            request.toPk,
            request.responseData,
        );
        const wallet = decryptedObj.get( WalletManagerImpl.DATA_KEY_ETH_WALLETS);

        // validator verifies the ETH wallets
        var res: WalletVerificationStatus = WalletUtils.validateWallets(
            WalletManagerImpl.DATA_KEY_ETH_WALLETS,
            JSON.parse(wallet),
            request.toPk
        );

        const result: Array<string> = [];

        if (res.rc == 0 && res.err == '') {
            const addresses: any = JSON.parse(wallet).data.map( (d: any) =>
                JSON.parse(d.data).ethAddr
            );
            for (let address of addresses) {
                result.push(address);
            }
        }
        return result;
    }
    private async _calculateWealthByAddresses(
        addresses: Array<string>,
        tokenContracts: Map<string, any>,
        tokenAddreesesToSymbols: Map<string, Token>,
        tokenRates: Map<string, any>) {

        let valuesOnAddress: Map<string, any> = new Map();
        let wealth: any = new BigNumber(0);

        try {
            for (let address of addresses) {
                valuesOnAddress = await this._getValueOfTokensByAddress(address,
                tokenContracts, tokenAddreesesToSymbols);

                wealth = wealth.plus(this._calculateWealth(valuesOnAddress, tokenRates));
            }
        } catch (e) {
            console.log(e);
        }

        return wealth.toString();
    }
    private async _getValueOfTokensByAddress(address: string, tokenContracts: Map<string, any>, tokens: Map<string, Token>) {
        const result: Map<string, any> = new Map();
        const prepareDec: any = new BigNumber(10);

        let value: any;
        let decimals: any;
        let valueResult: any;

        for (let [key, contract] of tokenContracts.entries()) {
            try {
                decimals = prepareDec.pow(tokens.get(key).decimals);
                value = await contract.methods.balanceOf(address).call();
                valueResult = new BigNumber(value).div(decimals);

                result.set(key, valueResult);

            } catch (e) {
                console.log('error on calculate:', key, e);
            }
        }
        try {
            const weiBalance: any = await this.web3.eth.getBalance(address);
            const ethBalance: any = this.web3.utils.fromWei(weiBalance);
            value = new BigNumber(ethBalance);

            result.set('ETH', value);
        } catch (e) {
            console.log('getValueOfTokensByAddress eth:', e);
        }
        return result;
    }
    private async _getTokenRates() {
        console.log('Fetching tokens prices to ETH from ' + this.cryptoCompareMinAPI + this.commaSeparatedTokens);
        const tokenRatesObj: any = await (await fetch(this.cryptoCompareMinAPI + this.commaSeparatedTokens)).json();

        const result: Map<string, any> = new Map();

        let ethVal: any;
        let ethBigN: any;

        for (let name in tokenRatesObj) {
            if (tokenRatesObj.hasOwnProperty(name) && tokenRatesObj[name].hasOwnProperty('ETH')) {
                ethVal = tokenRatesObj[name]['ETH'];
                ethBigN = new BigNumber(ethVal);
                result.set(name, ethBigN);

            } else {
                console.log('wrong data of token', name)
            }
        }

        if (result.size != this.tokenAddreesesToSymbols.size) {
            console.log('Can\'t fetch all token prices, only ' + result.size + ' of ' +
                this.tokenAddreesesToSymbols.size);

        } else {
            console.log('All token prices fetched');
        }

        return result;
    }
    private _calculateWealth(balances: Map<string, any>, symbolRates: Map<string, any>): any {
        let wealth: any = new BigNumber(0);
        let rate: any;

        for (let [key, balance] of balances.entries()) {
            try {
                if (symbolRates.has(key) && balance.gt(0)) {
                    rate = symbolRates.get(key);

                    wealth = wealth.plus(balance.multipliedBy(rate));
                }
            } catch (e) {
                console.log('calculateWealth', e);
            }
        }

        if (balances.has('ETH')) {
            wealth = wealth.plus(balances.get('ETH'));
        }
        return wealth;
    }
}

export default WealthValidator
