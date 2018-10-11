import { WealthValidator } from './wealthValidator'

const config = require('config');

export class Runner {
    delay: number;
    timer: any;
    worker: WealthValidator;
    constructor(worker: WealthValidator){
        this.delay = config.interval;
        this.worker = worker;
    }
    public start(){
        this.timer = setInterval( this.worker.workingCycle.bind(this.worker), this.delay);
    }
    public stop(){
        clearTimeout(this.timer);
    }
    public once() {
        this.worker.workingCycle();
    }
}

export default Runner
