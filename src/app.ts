process.env.NODE_CONFIG_DIR = __dirname + '/../src/config/';

import { Runner } from './runner'
import { WealthValidator } from './wealthValidator'

const worker = new WealthValidator();
const runner = new Runner(worker);

// runner.once();
runner.start();


