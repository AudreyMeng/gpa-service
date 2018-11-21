import { should } from 'chai';
import { mock, instance, verify } from 'ts-mockito';
import { Runner } from './../runner';
import { GPAService } from './../GPAService';

should();

describe('Runner', function() {
    it('should run Wealth Validator method "workingCycle"', () => {
        const mockedGPAService: GPAService = mock(GPAService);
        const worker: GPAService = instance(mockedGPAService);
        const runner = new Runner(1000, worker);
        runner.start();

        setInterval(()=>{
            runner.stop();
            verify(mockedGPAService.workingCycle()).times(4);
        }, 5000);



        // result.should.equals('Hello World', `Should return: Hello World, but returned: ${result}`);
    });
});
