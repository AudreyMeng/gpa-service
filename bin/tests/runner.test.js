"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ts_mockito_1 = require("ts-mockito");
const runner_1 = require("./../runner");
const wealthValidator_1 = require("./../wealthValidator");
chai_1.should();
describe('Runner', function () {
    it('should run Wealth Validator method "workingCycle"', () => {
        const mockedWealthValidator = ts_mockito_1.mock(wealthValidator_1.WealthValidator);
        const worker = ts_mockito_1.instance(mockedWealthValidator);
        const runner = new runner_1.Runner(1000, worker);
        runner.start();
        setInterval(() => {
            runner.stop();
            ts_mockito_1.verify(mockedWealthValidator.workingCycle()).times(4);
        }, 5000);
        // result.should.equals('Hello World', `Should return: Hello World, but returned: ${result}`);
    });
});
//# sourceMappingURL=runner.test.js.map