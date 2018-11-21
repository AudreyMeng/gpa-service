import Web3 from 'web3'
import Base from 'bitclave-base/'
import { SubscriptionManagerImpl, ServiceInfo, ServiceImpl } from 'bitclave-base/';

const config = require('config');
const nameServicePK: string = '032c8e7ae4b7ccfd85ca9499950b66fa4737d6460b1ab8ceac3658d7088841fb64';

export class GPAService {
    private web3 = new Web3(new Web3.providers.HttpProvider(config.api.web3));
    private base: Base;
    private accGPAServer: any;
    private gpaServiceInfo: any;
    private gpaService: any;
    constructor(){
        this.base = new Base(config.api.base, config.siteOrigin);
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

    // Initialize GPA service:
    //      1, generate serviceInfo and service
    //      2, announceService
    public async initialization() {
        console.log('##### GPA server initialization starts');

        this.accGPAServer = await this.base.accountManager.authenticationByPassPhrase(config.pass, config.unique);
        console.log(`#####GPA server has authorized with public key [${this.accGPAServer.publicKey}]`);
        // GPA server announces service to nameservice server
        this.gpaServiceInfo = new ServiceInfo(
            "gpa",
            this.accGPAServer.publicKey,
            "provide gpa certification service",
            ["courses"]
        );
        this.gpaService = new ServiceImpl(
            this.gpaServiceInfo,
            this.base.profileManager,
            this.base.dataRequestManager
        );
        await this.base.subscriptionManager.setNameServiceId(nameServicePK);
        // announce service
        // TODO: make GPA server wait here until finishing
        await this.base.subscriptionManager.announceService(this.gpaService);

        console.log('##### GPA server initialization ends');
    }

    public async workingCycle(){
        console.log('\n\n\n##### GPA server workingCycle starts');

        // TASK 1: GPA service handles user requests to ServiceInfo.
        const requestsFromUser = await this.base.dataRequestManager.getRequests( '', this.accGPAServer.publicKey);
        const max = requestsFromUser.length;
        for(let i=0; i< max; i++) {
            const request = requestsFromUser[i];
            const requestKey: Array<string> = await this.base.dataRequestManager.decryptMessage(
                request.fromPk,
                request.requestData
            );
            if (requestKey.length <= 0 || requestKey[0] != SubscriptionManagerImpl.KEY_SERVICE_INFO) {
                continue;
            }
            const grantFields = new Map();
            // Load previous granted permissions
            const keys: Array<string> = await this.base.dataRequestManager.getGrantedPermissionsToMe(request.fromPk);
            for (let j = 0; j < keys.length; ++j) {
                grantFields.set(keys[j], 0);
            }
            for (let j = 0; j < requestKey.length; ++j)  {
                grantFields.set(requestKey[j], 0); // Read
                await this.base.dataRequestManager.grantAccessForClient(request.fromPk, grantFields);
                console.log(`#####GPA server shares "${requestKey[0]}" with "${request.fromPk}"`);
            }
        }

        //TASK 2: GPA server handles subscription requests from users.
        const gpaRecords = await this.base.dataRequestManager.getRequests(
            this.accGPAServer.publicKey, ''
        );
        const gpaCalculateMap: Map<string, string> = new Map<string, string>();
        for(let i=0; i< gpaRecords.length; i++) {
            const request = gpaRecords[i];
            if (request.toPk == this.accGPAServer.publicKey || request.toPk == nameServicePK) {
                continue;
            }
            const newResult: Map<string, string> = await this.base.profileManager.getAuthorizedData(
                request.toPk,
                request.responseData
            );

            // calculate GPA
            const pregpa = newResult.get('courses') as string;
            if (pregpa == undefined) {
                continue;
            }
            const gpa = this.calculator(pregpa);
            console.log(`#####GPA server generates gpa [${gpa}] for user [${request.toPk}]`);
            gpaCalculateMap.set(request.toPk, String(gpa));
        }
        // GPA server writes updated accUser gpa to BASE
        // GPA server stores the data in <key, value> map,
        // where key is the public key of accUser
        await this.base.profileManager.updateData(gpaCalculateMap);

        // GPAServer writes status into storage and grant user
        const statusMap: Map<string, string> = new Map();
        for (let i=0; i< gpaRecords.length; i++) {
            const uid = gpaRecords[i].fromPk;
            // GPAServer addSubscriber
            const status = this.gpaService.addSubscriber(uid);

            statusMap.set(uid, JSON.stringify(status));

        }
        // GPA server writes status to BASE
        // GPA server stores the data in <key, value> map,
        // where key is the public key of accUser
        await this.base.profileManager.updateData(statusMap);

        //TASK 3: GPA server updates gpa of all users.
        // Update all accUser gpa from accUser
        const updateMap: Map<string, string> = new Map<string, string>();
        console.log(`#####GPA server updates user gpa`);
        const keys = Array.from((await this.base.profileManager.getData()).keys());
        for(let i = 0; i < keys.length; i++) {
            const uid = keys[i];
            if (/[^A-Za-z0-9]+$/.test(uid) ||
                uid == this.accGPAServer.publicKey ||
                uid == nameServicePK ||
                uid.includes('service')) { // invalid public key
                continue;
            }
            // GPA server gets courses from user
            const records = await this.base.dataRequestManager.getRequests(
                this.accGPAServer.publicKey, uid);
            const newResult: Map<string, string> = await this.base.profileManager.getAuthorizedData(
                uid, records[0].responseData);

            // calculate GPA
            const pregpa = newResult.get('courses') as string;
            const gpa = this.calculator(pregpa);
            console.log(`#####GPA server updates gpa [${gpa}] for user [${records[0].toPk}]`);
            updateMap.set(uid, String(gpa));
        }
        // GPA server writes updated accUser gpa to BASE
        // GPA server stores the data in <key, value> map,
        // where key is the public key of accUser
        await this.base.profileManager.updateData(updateMap);
        console.log('##### GPA server workingCycle ends');
    }
}

export default GPAService
