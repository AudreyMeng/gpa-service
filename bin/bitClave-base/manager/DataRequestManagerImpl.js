"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonUtils_1 = require("../utils/JsonUtils");
class DataRequestManagerImpl {
    constructor(dataRequestRepository, authAccountBehavior, encrypt, decrypt) {
        this.dataRequestRepository = dataRequestRepository;
        this.encrypt = encrypt;
        this.decrypt = decrypt;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    /**
     * Creates data access request to a specific user for a specific personal data.
     * @param {string} recipientPk Public Key of the user that the personal data is requested from.
     * @param {Array<string>} fields Array of name identifiers for the requested data fields
     * (e.g. this is keys in {Map<string, string>}).
     *
     * @returns {Promise<number>} Returns requestID upon successful request record creation.
     */
    requestPermissions(recipientPk, fields) {
        return this.encrypt
            .encryptMessage(recipientPk, JSON.stringify(fields).toLowerCase())
            .then((encrypted) => this.dataRequestRepository.requestPermissions(recipientPk, encrypted));
    }
    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    getRequests(fromPk = '', toPk = '') {
        return this.dataRequestRepository.getRequests(fromPk, toPk);
    }
    /**
     * Grants access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Map<string, AccessRight>} acceptedFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    async grantAccessForClient(clientPk, acceptedFields) {
        const response = await this.encrypt.encryptPermissionsFields(clientPk, acceptedFields);
        return await this.dataRequestRepository.grantAccessForClient(clientPk, this.account.publicKey, response);
    }
    /**
     * Returns list of fields requested for access by <me> from the client
     * @param {string} requestedFromPk id (baseID) of the client whose permissions were requested
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    async getRequestedPermissions(requestedFromPk) {
        const requests = await this.getRequests(this.account.publicKey, requestedFromPk);
        return await this.decodeRequestedPermissions(requests, requestedFromPk);
    }
    /**
     * Returns list of fields requested for access by the client from <me>
     * @param {string} whoRequestedPk id (baseID) of the client that asked for permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    async getRequestedPermissionsToMe(whoRequestedPk) {
        const requests = await this.getRequests(whoRequestedPk, this.account.publicKey);
        return await this.decodeRequestedPermissions(requests, whoRequestedPk);
    }
    /**
     * Returns list of fields that <client> authorized <me> to access
     * @param {string} clientPk id (baseID) of the client that granted me permission.
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    async getGrantedPermissions(clientPk) {
        const requests = await this.getRequests(this.account.publicKey, clientPk);
        return await this.getDecodeGrantPermissions(requests, clientPk);
    }
    /**
     * Returns list of fields that <me> authorized <client> to access
     * @param {string} clientPk id (baseID) of the client that received access permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    async getGrantedPermissionsToMe(clientPk) {
        const requests = await this.getRequests(clientPk, this.account.publicKey);
        return await this.getDecodeGrantPermissions(requests, clientPk);
    }
    /**
     * Grant access for offer.
     * @param {number} offerSearchId id of item search result {@link OfferSearch} and {@link OfferSearchResultItem}.
     * @param {string} offerOwner Public key of offer owner.
     * @param {Map<string, AccessRight>} acceptedFields. Map with names of fields for accept access and access rights.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    grantAccessForOffer(offerSearchId, offerOwner, acceptedFields) {
        return this.encrypt.encryptPermissionsFields(offerOwner, acceptedFields)
            .then(encrypted => this.dataRequestRepository.grantAccessForOffer(offerSearchId, this.account.publicKey, encrypted));
    }
    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    decryptMessage(senderPk, encrypted) {
        return this.decrypt.decryptMessage(senderPk, encrypted)
            .then(decrypted => {
            try {
                return JSON.parse(decrypted);
            }
            catch (e) {
                return decrypted;
            }
        }).catch(reason => encrypted);
    }
    async decodeRequestedPermissions(requests, clientPk) {
        if (requests.length > 0 && requests[0].requestData.trim().length > 0) {
            try {
                const strDecrypt = await this.decrypt.decryptMessage(clientPk, requests[0].requestData);
                return JSON.parse(strDecrypt);
            }
            catch (e) {
                return [];
            }
        }
        else {
            return [];
        }
    }
    async getDecodeGrantPermissions(requests, clientPk) {
        if (requests.length > 0 && requests[0].responseData.trim().length > 0) {
            const strDecrypt = await this.decrypt.decryptMessage(clientPk, requests[0].responseData);
            const jsonDecrypt = JSON.parse(strDecrypt);
            const mapResponse = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
            return Array.from(mapResponse.keys());
        }
        else {
            return [];
        }
    }
    onChangeAccount(account) {
        this.account = account;
    }
}
exports.DataRequestManagerImpl = DataRequestManagerImpl;
//# sourceMappingURL=DataRequestManagerImpl.js.map