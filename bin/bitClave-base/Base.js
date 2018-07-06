"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccountRepositoryImpl_1 = __importDefault(require("./repository/account/AccountRepositoryImpl"));
const ClientDataRepositoryImpl_1 = __importDefault(require("./repository/client/ClientDataRepositoryImpl"));
const Rx_1 = require("rxjs/Rx");
const Account_1 = __importDefault(require("./repository/models/Account"));
const SignInterceptor_1 = __importDefault(require("./repository/source/http/SignInterceptor"));
const DataRequestRepositoryImpl_1 = __importDefault(require("./repository/requests/DataRequestRepositoryImpl"));
const RepositoryStrategyInterceptor_1 = require("./repository/source/http/RepositoryStrategyInterceptor");
const RepositoryStrategyType_1 = require("./repository/RepositoryStrategyType");
const OfferRepositoryImpl_1 = __importDefault(require("./repository/offer/OfferRepositoryImpl"));
const SearchRequestRepositoryImpl_1 = __importDefault(require("./repository/search/SearchRequestRepositoryImpl"));
const SearchRequest_1 = __importDefault(require("./repository/models/SearchRequest"));
exports.SearchRequest = SearchRequest_1.default;
const Offer_1 = __importDefault(require("./repository/models/Offer"));
exports.Offer = Offer_1.default;
const HttpTransportImpl_1 = require("./repository/source/http/HttpTransportImpl");
const NonceInterceptor_1 = __importDefault(require("./repository/source/http/NonceInterceptor"));
const BaseSchema_1 = require("./utils/types/BaseSchema");
const AssistantNodeRepository_1 = require("./repository/assistant/AssistantNodeRepository");
const TransportFactory_1 = require("./repository/source/TransportFactory");
const KeyPairFactory_1 = require("./utils/keypair/KeyPairFactory");
const SiteRepositoryImpl_1 = require("./repository/site/SiteRepositoryImpl");
const AccountManagerImpl_1 = require("./manager/AccountManagerImpl");
const DataRequestManagerImpl_1 = require("./manager/DataRequestManagerImpl");
const ProfileManagerImpl_1 = require("./manager/ProfileManagerImpl");
const OfferManagerImpl_1 = require("./manager/OfferManagerImpl");
const SearchManagerImpl_1 = require("./manager/SearchManagerImpl");
const WalletManagerImpl_1 = require("./manager/WalletManagerImpl");
exports.WalletManagerImpl = WalletManagerImpl_1.WalletManagerImpl;
const OfferSearchRepositoryImpl_1 = require("./repository/search/OfferSearchRepositoryImpl");
const OfferSearchResultItem_1 = __importDefault(require("./repository/models/OfferSearchResultItem"));
exports.OfferSearchResultItem = OfferSearchResultItem_1.default;
const OfferSearch_1 = __importStar(require("./repository/models/OfferSearch"));
exports.OfferSearch = OfferSearch_1.default;
exports.OfferResultAction = OfferSearch_1.OfferResultAction;
const OfferShareData_1 = __importDefault(require("./repository/models/OfferShareData"));
exports.OfferShareData = OfferShareData_1.default;
var RepositoryStrategyType_2 = require("./repository/RepositoryStrategyType");
exports.RepositoryStrategyType = RepositoryStrategyType_2.RepositoryStrategyType;
var CompareAction_1 = require("./repository/models/CompareAction");
exports.CompareAction = CompareAction_1.CompareAction;
var TransportFactory_2 = require("./repository/source/TransportFactory");
exports.TransportFactory = TransportFactory_2.TransportFactory;
var KeyPairFactory_2 = require("./utils/keypair/KeyPairFactory");
exports.KeyPairFactory = KeyPairFactory_2.KeyPairFactory;
var CryptoUtils_1 = require("./utils/CryptoUtils");
exports.CryptoUtils = CryptoUtils_1.CryptoUtils;
var WalletUtils_1 = require("./utils/WalletUtils");
exports.WalletUtils = WalletUtils_1.WalletUtils;
exports.WalletVerificationStatus = WalletUtils_1.WalletVerificationStatus;
var JsonUtils_1 = require("./utils/JsonUtils");
exports.JsonUtils = JsonUtils_1.JsonUtils;
var EthereumUtils_1 = require("./utils/EthereumUtils");
exports.EthereumUtils = EthereumUtils_1.EthereumUtils;
var KeyPair_1 = require("./utils/keypair/KeyPair");
exports.KeyPair = KeyPair_1.KeyPair;
var Permissions_1 = require("./utils/keypair/Permissions");
exports.Permissions = Permissions_1.Permissions;
exports.AccessRight = Permissions_1.AccessRight;
var AcceptedField_1 = require("./utils/keypair/AcceptedField");
exports.AcceptedField = AcceptedField_1.AcceptedField;
var RpcToken_1 = require("./utils/keypair/rpc/RpcToken");
exports.RpcToken = RpcToken_1.RpcToken;
var RpcAuth_1 = require("./utils/keypair/rpc/RpcAuth");
exports.RpcAuth = RpcAuth_1.RpcAuth;
var BaseTypes_1 = require("./utils/types/BaseTypes");
exports.BaseAddrPair = BaseTypes_1.BaseAddrPair;
exports.AddrRecord = BaseTypes_1.AddrRecord;
exports.WalletsRecords = BaseTypes_1.WalletsRecords;
exports.WealthRecord = BaseTypes_1.WealthRecord;
exports.WealthPtr = BaseTypes_1.WealthPtr;
exports.ProfileUser = BaseTypes_1.ProfileUser;
exports.ProfileWealthValidator = BaseTypes_1.ProfileWealthValidator;
class Base {
    constructor(nodeHost, siteOrigin, strategy = RepositoryStrategyType_1.RepositoryStrategyType.Postgres, signerHost = '') {
        this._authAccountBehavior = new Rx_1.BehaviorSubject(new Account_1.default());
        this._repositoryStrategyInterceptor = new RepositoryStrategyInterceptor_1.RepositoryStrategyInterceptor(strategy);
        const assistantHttpTransport = new HttpTransportImpl_1.HttpTransportImpl(nodeHost)
            .addInterceptor(this._repositoryStrategyInterceptor);
        const nodeAssistant = this.createNodeAssistant(assistantHttpTransport);
        const keyPairHelper = this.createKeyPairHelper(signerHost, nodeAssistant, nodeAssistant, siteOrigin);
        const messageSigner = keyPairHelper;
        const encryptMessage = keyPairHelper;
        const decryptMessage = keyPairHelper;
        const transport = TransportFactory_1.TransportFactory.createHttpTransport(nodeHost)
            .addInterceptor(new SignInterceptor_1.default(messageSigner))
            .addInterceptor(new NonceInterceptor_1.default(messageSigner, nodeAssistant))
            .addInterceptor(this._repositoryStrategyInterceptor);
        const accountRepository = new AccountRepositoryImpl_1.default(transport);
        const clientDataRepository = new ClientDataRepositoryImpl_1.default(transport);
        const dataRequestRepository = new DataRequestRepositoryImpl_1.default(transport);
        const offerRepository = new OfferRepositoryImpl_1.default(transport);
        const searchRequestRepository = new SearchRequestRepositoryImpl_1.default(transport);
        const offerSearchRepository = new OfferSearchRepositoryImpl_1.OfferSearchRepositoryImpl(transport);
        this._accountManager = new AccountManagerImpl_1.AccountManagerImpl(accountRepository, keyPairHelper, messageSigner, this._authAccountBehavior);
        this._dataRequestManager = new DataRequestManagerImpl_1.DataRequestManagerImpl(dataRequestRepository, this._authAccountBehavior.asObservable(), encryptMessage, decryptMessage);
        this._profileManager = new ProfileManagerImpl_1.ProfileManagerImpl(clientDataRepository, this._authAccountBehavior.asObservable(), encryptMessage, decryptMessage, messageSigner);
        this._offerManager = new OfferManagerImpl_1.OfferManagerImpl(offerRepository, this._authAccountBehavior.asObservable());
        this._searchManager = new SearchManagerImpl_1.SearchManagerImpl(searchRequestRepository, offerSearchRepository, this._authAccountBehavior.asObservable());
        this._walletManager = new WalletManagerImpl_1.WalletManagerImpl(this.profileManager, this.dataRequestManager, new BaseSchema_1.BaseSchema(), messageSigner, this._authAccountBehavior.asObservable());
    }
    changeStrategy(strategy) {
        this._repositoryStrategyInterceptor.changeStrategy(strategy);
    }
    get walletManager() {
        return this._walletManager;
    }
    get accountManager() {
        return this._accountManager;
    }
    get profileManager() {
        return this._profileManager;
    }
    get dataRequestManager() {
        return this._dataRequestManager;
    }
    get offerManager() {
        return this._offerManager;
    }
    get searchManager() {
        return this._searchManager;
    }
    createNodeAssistant(httpTransport) {
        const accountRepository = new AccountRepositoryImpl_1.default(httpTransport);
        const dataRequestRepository = new DataRequestRepositoryImpl_1.default(httpTransport);
        const siteRepository = new SiteRepositoryImpl_1.SiteRepositoryImpl(httpTransport);
        return new AssistantNodeRepository_1.AssistantNodeRepository(accountRepository, dataRequestRepository, siteRepository);
    }
    createKeyPairHelper(signerHost, permissionSource, siteDataSource, siteOrigin) {
        return (signerHost.length == 0)
            ? KeyPairFactory_1.KeyPairFactory.createDefaultKeyPair(permissionSource, siteDataSource, siteOrigin)
            : KeyPairFactory_1.KeyPairFactory.createRpcKeyPair(TransportFactory_1.TransportFactory.createJsonRpcHttpTransport(signerHost));
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map