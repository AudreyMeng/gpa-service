"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Runner {
    constructor(delay, worker) {
        this.delay = delay;
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