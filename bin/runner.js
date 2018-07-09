"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('config');
class Runner {
    constructor(worker) {
        this.delay = config.interval;
        this.worker = worker;
    }
    start() {
        this.timer = setInterval(this.worker.workingCycle.bind(this.worker), this.delay);
    }
    stop() {
        clearTimeout(this.timer);
    }
    once() {
        this.worker.workingCycle();
    }
}
exports.Runner = Runner;
exports.default = Runner;
//# sourceMappingURL=runner.js.map