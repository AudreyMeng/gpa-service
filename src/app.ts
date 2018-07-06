
import { Runner } from './runner'
import { WealthValidator } from './wealthValidator'

const interval = 1000 * 40;
const worker = new WealthValidator();
const runner = new Runner(interval, worker);

runner.once();

runner.start();

// setTimeout(()=>{
//     console.log('stop');
//     runner.stop();
// }, 5000);
