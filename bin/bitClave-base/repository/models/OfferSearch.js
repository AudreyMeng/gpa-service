"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OfferSearch {
    constructor(searchRequestId = 0, offerId = 0) {
        this.id = 0;
        this.searchRequestId = 0;
        this.offerId = 0;
        this.state = OfferResultAction.NONE;
        this.searchRequestId = searchRequestId;
        this.offerId = offerId;
    }
}
exports.default = OfferSearch;
var OfferResultAction;
(function (OfferResultAction) {
    OfferResultAction["NONE"] = "NONE";
    OfferResultAction["ACCEPT"] = "ACCEPT";
    OfferResultAction["REJECT"] = "REJECT";
})(OfferResultAction = exports.OfferResultAction || (exports.OfferResultAction = {}));
//# sourceMappingURL=OfferSearch.js.map