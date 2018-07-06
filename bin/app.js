"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("./runner");
const wealthValidator_1 = require("./wealthValidator");
const interval = 1000 * 40;
const worker = new wealthValidator_1.WealthValidator();
const runner = new runner_1.Runner(interval, worker);
runner.once();
runner.start();
// setTimeout(()=>{
//     console.log('stop');
//     runner.stop();
// }, 5000);
//# sourceMappingURL=app.js.map