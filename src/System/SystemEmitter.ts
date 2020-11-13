import EventEmitter from 'eventemitter3';

class SystemEmitter {
    private eventEmitter: EventEmitter;
    private timerId?: number | null;
    private systemType: symbol;
    private canTimerBeRun: boolean;

    constructor(systemType: symbol, callback: (value: string) => void) {
        this.canTimerBeRun = true;
        this.timerId = null;
        this.systemType = systemType;
        this.eventEmitter = new EventEmitter();

        this.eventEmitter.on(systemType, (value: string) => {
            callback(value);
        })
    }

    public start = (): void => {
        this.canTimerBeRun = true;
        this.timerId = this.runRandomGenerator();
    }

    public stop = (): void => {
        this.canTimerBeRun = false;

        if (!this.timerId) {
            return;
        }

        clearTimeout(this.timerId);
        this.timerId = null;
    }

    private runRandomGenerator = (): number => {
        return setTimeout(
            () => {
                this.eventEmitter.emit(this.systemType, this.getRandomString());
                if (this.canTimerBeRun) {
                    this.start()
                }
            },
            this.getRandomDelay()
        )
    }

    private getRandomString = (): string => {
        return this.getRandomInt(0, 100).toString();
    }

    private getRandomDelay = (): number => {
        return this.getRandomInt(100, 2000);
    }

    private getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * Math.floor(max)) + min;
    }
}

export default SystemEmitter;