"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OfferSearch_1 = __importDefault(require("./OfferSearch"));
const Offer_1 = __importDefault(require("./Offer"));
class OfferSearchResultItem {
    constructor(offerSearch = new OfferSearch_1.default(), offer = new Offer_1.default()) {
        this.offerSearch = offerSearch;
        this.offer = offer;
    }
}
exports.default = OfferSearchResultItem;
//# sourceMappingURL=OfferSearchResultItem.js.map