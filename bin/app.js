"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_CONFIG_DIR = __dirname + '/../src/config/';
const runner_1 = require("./runner");
const wealthValidator_1 = require("./wealthValidator");
const worker = new wealthValidator_1.WealthValidator();
const runner = new runner_1.Runner(worker);
// runner.once();
runner.start();
//# sourceMappingURL=app.js.map