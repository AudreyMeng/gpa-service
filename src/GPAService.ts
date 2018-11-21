import Web3 from 'web3'
import Base from 'bitclave-base/'
import { ServiceInfo, Service } from 'bitclave-base/';
import { ServiceImpl } from 'bitclave-base/';
import { SubscriptionManagerImpl } from 'bitclave-base/';
import Account from "bitclave-base/repository/models/Account";

const config = require('config');

export class GPAService {
    private web3 = new Web3(new Web3.providers.HttpProvider(config.api.web3));
    private base: Base;
    private userbase: Base;
    private nameservicebase: Base;
    private accGPAServer: any;
    private gpaService: any;
    constructor(){
        this.base = new Base(config.api.base, config.siteOrigin);
        this.userbase = new Base(config.api.base, config.siteOrigin);
        this.nameservicebase = new Base(config.api.base, config.siteOrigin);
    }

    private calculator(pregpa : String) {
        const courseGPA = pregpa.split(',');
        var gpa = 0;
        for(let i = 0; i < courseGPA.length; i++) {
            gpa += Number(courseGPA[i]);
        }
        gpa = gpa / courseGPA.length;
        return gpa;
    }

    public async initialization() {
        this.accGPAServer = await this.base.accountManager.authenticationByPassPhrase(config.pass, config.unique);
        console.log(`#####GPA service provider has authorized. its public key is "${accGPAServer.publicKey}"`);
        // GPA server announces service to nameservice server
        const gpaServiceInfo = new ServiceInfo(
            "gpa",
            accGPAServer.publicKey,
            "provide gpa certification service",
            ["courses"]
        );
        console.log(`##### gpaServiceInfo`);
        this.gpaService = new ServiceImpl(
            gpaServiceInfo,
            this.base.profileManager,
            this.base.dataRequestManager
        );
        console.log(`##### gpaService`);
    }

    public async workingCycle(){
        // TODO: move initialized communication with name server into independent part.
        const accGPAServer = await this.base.accountManager.authenticationByPassPhrase(config.pass, config.unique);
        console.log(`#####GPA service provider has authorized. its public key is "${accGPAServer.publicKey}"`);

        // for test: user
        const accUser = await this.userbase.accountManager.authenticationByPassPhrase(config.userpass, config.userunique);
        console.log(`#####user has authorized. its public key is "${accUser.publicKey}"`);
        // create wallets for Alice
        await this.userbase.profileManager.updateData(
            new Map([['courses', '1, 4, 3, 3']])
        );
        console.log(`#####user update gpa`);

        // for test: nameservice server
        const accNameService = await this.nameservicebase.accountManager.authenticationByPassPhrase(config.nameservicepass, config.nameserviceunique);
        console.log(`#####accNameService has authorized. its public key is "${accNameService.publicKey}"`);

        const nameServiceInfo = new ServiceInfo(
            'name_service',
            accNameService.publicKey,
            'provide service provider id lookup service',
            [SubscriptionManagerImpl.KEY_SERVICE_INFO]
        );
        const nameService = new ServiceImpl(
            nameServiceInfo,
            this.nameservicebase.profileManager,
            this.nameservicebase.dataRequestManager
        );
        await this.nameservicebase.subscriptionManager.announceService(nameService);
        console.log(`##### nameservice server`);

        // GPA server announces service to nameservice server
        const gpaServiceInfo = new ServiceInfo(
            "gpa",
            accGPAServer.publicKey,
            "provide gpa certification service",
            ["courses"]
        );
        console.log(`##### gpaServiceInfo`);
        const gpaService = new ServiceImpl(
            gpaServiceInfo,
            this.base.profileManager,
            this.base.dataRequestManager
        );
        console.log(`##### gpaService`);

        // const tempgrantFields = new Map();
        // tempgrantFields.set(SubscriptionManagerImpl.KEY_SERVICE_INFO, 0);
        // await this.nameservicebase.dataRequestManager.grantAccessForClient(accGPAServer.publicKey, tempgrantFields);
        //
        // await this.base.subscriptionManager.setNameServiceId(accNameService.publicKey);
        // console.log('##### GPA server setNameServiceId');
        await this.base.subscriptionManager.announceService(gpaService);
        console.log('##### GPA server announces service');

        // for test: Name service grant 'service' entry to service provider
        const announceGrant = new Map();
        announceGrant.set('service', 0); // Read
        await this.nameservicebase.dataRequestManager.grantAccessForClient(accGPAServer.publicKey, announceGrant);
        console.log('##### Name service grant \'service\' entry to service provider');

        // // for test Asssumption: Name server has already add subscripter and shared back GPAServer to user
        // await this.userbase.subscriptionManager.getServiceInfo(accGPAServer.publicKey);
        // console.log('##### user asks service info from GPA server');
        await this.userbase.dataRequestManager.requestPermissions(
            accGPAServer.publicKey, [SubscriptionManagerImpl.KEY_SERVICE_INFO]);
        // GPA service grant accUser with access to ServiceInfo
        const requestsFromUser = await this.base.dataRequestManager.getRequests( '', accGPAServer.publicKey);
        console.log(`#####user request size is ${requestsFromUser.length}`);
        const max = requestsFromUser.length;
        for(let i=0; i< max; i++) {
            const request = requestsFromUser[i];
            // console.log(`#####request fromPk is ${request.fromPk}`);
            const requestKey: Array<string> = await this.base.dataRequestManager.decryptMessage(
                request.fromPk,
                request.requestData
            );
            // console.log(`#####requestKey size is ${requestKey.length}`);
            console.log(`#####requestKey: "${requestKey[0]}"`);
            if (requestKey.length > 0) {
                const grantFields = new Map();
                grantFields.set(requestKey[0], 0); // Read
                await this.base.dataRequestManager.grantAccessForClient(request.fromPk, grantFields);
                console.log(`#####GPA service provider shared "${requestKey[0]}" with "${request.fromPk}"`);
            }
        }

        // for test： user subscribes to grant all required keys to GPAServer
        //TODO: GPA server how to check all subscription request.
        const returnVal = this.userbase.subscriptionManager.subscribe(gpaServiceInfo);
        console.log(`#####user subscribes to GPA server, returns "${JSON.stringify(returnVal)}"`);
        const gpaRecords = await this.base.dataRequestManager.getRequests(
            '', accGPAServer.publicKey
        );
        const gpaCalculateMap: Map<string, string> = new Map<string, string>();
        for(let i=0; i< gpaRecords.length; i++) {
            const request = gpaRecords[i];
            console.log(`#####first request fromPk is ${request.fromPk}`);
            console.log(`#####first request toPk is ${request.toPk}`);

            const requestKeykey: Array<string> = await this.base.dataRequestManager.decryptMessage(
                request.fromPk,
                request.requestData
            );
            console.log(`#####requestKeykey is ${requestKeykey[0]}`);
            const newResult: Map<string, string> = await this.base.profileManager.getAuthorizedData(
                request.fromPk,
                request.responseData
            );
            console.log(`#####first request is ${JSON.stringify(newResult)}`);

            // calculate GPA
            const pregpa = newResult.get('courses') as string;
            if (pregpa == undefined) {
                continue;
            }
            console.log(`#####first request pregpa is ${pregpa}`);
            const gpa = this.calculator(pregpa);
            console.log(`#####first accGPAServer this gpa "${gpa}"`);
            gpaCalculateMap.set(request.fromPk + '#gpa', String(gpa));
        }
        // GPA server writes updated accUser gpa to BASE
        // GPA server stores the data in <key, value> map,
        // where key is the public key of accUser
        await this.base.profileManager.updateData(gpaCalculateMap);

        // GPAServer addSubscriber
        const status = gpaService.addSubscriber(accUser.publicKey);
        // GPAServer writes status into storage and grant user
        const statusMap: Map<string, string> = new Map();
        statusMap.set(accUser.publicKey, JSON.stringify(status));
        // GPA server writes status to BASE
        // GPA server stores the data in <key, value> map,
        // where key is the public key of accUser
        await this.base.profileManager.updateData(statusMap);
        console.log(`#####accGPAServer update statusmap`);
        // calculate GPA
        const records = await this.base.dataRequestManager.getRequests(
            '', accGPAServer.publicKey
        );


        // Update all accUser gpa from accUser
        const updateMap: Map<string, string> = new Map<string, string>();
        console.log(`#####accGPAServer updateMap`);
        const keys = Array.from((await this.base.profileManager.getData()).keys());
        // console.log(`#####accGPAServer keys size "${keys.length}"`);

        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];
            console.log(`#####accGPAServer key "${key}"`);
            if (/^[a-zA-Z]+$/.test(key) ||
                key == accGPAServer.publicKey ||
                key == accNameService.publicKey ||
                !key.includes('#gpa')) { // invalid public key
                continue;
            }
            const uid = key.split('#');
            await this.base.dataRequestManager.requestPermissions(key, ['courses']);
            // console.log(`#####accGPAServer key await`);
            const records = await this.base.dataRequestManager.getRequests(
                accGPAServer.publicKey, uid[0]
            );
            const newResult: Map<string, string> = await this.base.profileManager.getAuthorizedData(
                uid[0],
                records[0].responseData
            );

            // calculate GPA
            const pregpa = newResult.get('courses') as string;
            const gpa = this.calculator(pregpa);
            console.log(`#####accGPAServer this gpa "${gpa}"`);
            updateMap.set(uid[0] + '#gpa', String(gpa));
        }
        // GPA server writes updated accUser gpa to BASE
        // GPA server stores the data in <key, value> map,
        // where key is the public key of accUser
        await this.base.profileManager.updateData(updateMap);
        console.log('finish.');
    }
}

export default WealthValidator
