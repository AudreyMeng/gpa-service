import Web3 from 'web3'
import fetch from 'node-fetch'
import { BigNumber } from 'bignumber.js'

import Base, { WalletUtils, WalletManagerImpl } from 'bitclave-base/'
import Token from './token'

const config = require('config');

export class WealthValidator {
    private commaSeparatedTokens: string;
    private cryptoCompareMinAPI = config.api.cryptocompare;
    private tokenContracts: Map<string, any> = new Map()
    private tokenAddreesesToSymbols: Map<string, Token>
    private web3 = new Web3(new Web3.providers.HttpProvider(config.api.web3));
    base: Base;
    constructor(){
        // this.base = new Base('https://base2-bitclva-com.herokuapp.com', 'localhost');
        this.base = new Base(config.api.base, config.siteOrigin);

        this.tokenAddreesesToSymbols = new Map();
        config.tokens.forEach( (e: any) => this.tokenAddreesesToSymbols.set(e.name, new Token(e.addr, e.num)));

        const tokenSymbols: Array<string> = Array.from(this.tokenAddreesesToSymbols.keys());
        this.commaSeparatedTokens = tokenSymbols.join(',');
    }
    public async workingCycle(){
        console.log('start life-cycle');

        const tokenRates: Map<string, any> = await this._getTokenRates();
        const accValidator = await this.base.accountManager.authenticationByPassPhrase(config.pass, config.unique);
        console.log(`Wealth validator has authorized. it public key is "${accValidator.publicKey}"`);

        const requestsByFrom = await this.base.dataRequestManager.getRequests( accValidator.publicKey, '');
        console.log(`requests length is ${requestsByFrom.length}`);

        const wealthMap: Map<string, string> = await this.base.profileManager.getData();

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
        // Validator stores the data in <key, value> map,
        // where key is the public key of the user that asked for verification
        await this.base.profileManager.updateData(wealthMap);


        for(let i=0, max = requestsByFrom.length; i< max; i++) {
            const request = requestsByFrom[i];
            const grantFields = new Map();
            // grantFields.clear();
            grantFields.set(request.toPk, 0); // Read,

            // Validator shares wealth records with the original owners of the wallets
            await this.base.dataRequestManager.grantAccessForClient(request.toPk, grantFields);
            console.log('Validator shared wealth records with the original owners of the wallets')
        }
        console.log('finish.');
    }

    private async _getEthAddresses(request: any) {
        const decryptedObj: any = await this.base.profileManager.getAuthorizedData(
            request.toPk,
            request.responseData,
        );
        const wallet = decryptedObj.get( WalletManagerImpl.DATA_KEY_ETH_WALLETS);

        // validator verifies the ETH wallets
        var res = WalletUtils.validateWallets(
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
        tokenRates: Map<string, any>
    ){

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
