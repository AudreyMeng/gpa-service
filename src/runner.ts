import { GPAService } from './GPAService'

const config = require('config');

export class Runner {
    delay: number;
    timer: any;
    worker: GPAService;
    constructor(worker: GPAService){
        this.delay = config.interval;
        this.worker = worker;
    }
    public start(){
        this.worker.initialization();
        this.timer = setInterval( this.worker.workingCycle.bind(this.worker), this.delay);
    }
    public stop(){
        clearTimeout(this.timer);
    }
    public once() {
        this.worker.initialization();
        this.worker.workingCycle();
    }
}

export default Runner
