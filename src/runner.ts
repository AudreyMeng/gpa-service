import { WealthValidator } from './wealthValidator'
export class Runner {
    delay: Number;
    timer: any;
    worker: WealthValidator;
    constructor(delay: number, worker: WealthValidator){
        this.delay = delay;
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
