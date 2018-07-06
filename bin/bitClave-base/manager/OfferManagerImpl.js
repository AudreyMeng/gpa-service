"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = __importDefault(require("../repository/models/Account"));
class OfferManagerImpl {
    constructor(offerRepository, authAccountBehavior) {
        this.account = new Account_1.default();
        this.offerRepository = offerRepository;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    saveOffer(offer) {
        const offerId = offer.id;
        if (offerId <= 0) {
            return this.offerRepository.create(this.account.publicKey, offer);
        }
        else {
            return this.offerRepository.update(this.account.publicKey, offerId, offer);
        }
    }
    getMyOffers(id = 0) {
        if (id > 0) {
            return this.offerRepository.getOfferByOwnerAndId(this.account.publicKey, id);
        }
        else {
            return this.offerRepository.getOfferByOwner(this.account.publicKey);
        }
    }
    getAllOffers() {
        return this.offerRepository.getAllOffer();
    }
    deleteOffer(id) {
        return this.offerRepository.deleteById(this.account.publicKey, id);
    }
    onChangeAccount(account) {
        this.account = account;
    }
}
exports.OfferManagerImpl = OfferManagerImpl;
//# sourceMappingURL=OfferManagerImpl.js.map