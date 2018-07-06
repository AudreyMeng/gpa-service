"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryStrategyInterceptor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    changeStrategy(strategy) {
        this.strategy = strategy;
    }
    onIntercept(cortege) {
        return new Promise(resolve => {
            cortege.headers.set('Strategy', this.strategy);
            resolve(cortege);
        });
    }
}
exports.RepositoryStrategyInterceptor = RepositoryStrategyInterceptor;
//# sourceMappingURL=RepositoryStrategyInterceptor.js.map