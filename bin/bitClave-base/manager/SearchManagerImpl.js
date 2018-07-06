"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = __importDefault(require("../repository/models/Account"));
class SearchManagerImpl {
    constructor(requestRepository, offerSearchRepository, authAccountBehavior) {
        this.account = new Account_1.default();
        this.requestRepository = requestRepository;
        this.offerSearchRepository = offerSearchRepository;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    createRequest(searchRequest) {
        return this.requestRepository.create(this.account.publicKey, searchRequest);
    }
    getMyRequests(id = 0) {
        if (id > 0) {
            return this.requestRepository.getSearchRequestByOwnerAndId(this.account.publicKey, id);
        }
        else {
            return this.requestRepository.getSearchRequestByOwner(this.account.publicKey);
        }
    }
    getAllRequests() {
        return this.requestRepository.getAllSearchRequests();
    }
    deleteRequest(id) {
        return this.requestRepository.deleteById(this.account.publicKey, id);
    }
    getSearchResult(searchRequestId) {
        return this.offerSearchRepository.getSearchResult(this.account.publicKey, searchRequestId);
    }
    complainToSearchItem(searchResultId) {
        return this.offerSearchRepository.complainToSearchItem(this.account.publicKey, searchResultId);
    }
    addResultItem(offerSearch) {
        return this.offerSearchRepository.addResultItem(this.account.publicKey, offerSearch);
    }
    onChangeAccount(account) {
        this.account = account;
    }
}
exports.SearchManagerImpl = SearchManagerImpl;
//# sourceMappingURL=SearchManagerImpl.js.map