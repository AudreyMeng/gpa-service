"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let storage;
if (typeof localStorage === 'undefined' || localStorage === null) {
    const nodeStorage = require('node-localstorage').LocalStorage;
    storage = new nodeStorage('./scratch');
}
else {
    storage = localStorage;
}
class LocalStorageImpl {
    setItem(key, value) {
        storage.setItem(key, value);
    }
    getItem(key) {
        return storage.getItem(key);
    }
}
exports.default = LocalStorageImpl;
//# sourceMappingURL=LocalStorageImpl.js.map