"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = __importDefault(require("../models/Account"));
// this class assistant for only read data from Base-node. without any permissions
class AssistantNodeRepository {
    constructor(accountRepository, dataRequestRepository, siteRepository) {
        this.accountRepository = accountRepository;
        this.dataRequestRepository = dataRequestRepository;
        this.siteRepository = siteRepository;
    }
    getGrandAccessRecords(publicKeyFrom, publicKeyTo) {
        return this.dataRequestRepository.getRequests(publicKeyFrom, publicKeyTo);
    }
    getNonce(publicKey) {
        return this.accountRepository.getNonce(new Account_1.default(publicKey));
    }
    getSiteData(origin) {
        return this.siteRepository.getSiteData(origin);
    }
}
exports.AssistantNodeRepository = AssistantNodeRepository;
//# sourceMappingURL=AssistantNodeRepository.js.map