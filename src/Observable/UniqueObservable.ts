import { SystemType } from "../Models/MonitoringSystem";
import SystemEmitter from "../System/SystemEmitter";

export type UniqueObservableType = {
    temperature: string,
    airPressure: string,
    humidity: string
}

class UniqueObservable {
    private callback: (displayObject: UniqueObservableType) => void = () => { };
    private emittersArray: SystemEmitter[] = [];
    private timerDict: { [key: string]: number } = {};
    private result: UniqueObservableType = {} as UniqueObservableType;
    private lastSentDate: number = new Date().getTime();

    public subscribe = (callback: (displayObject: UniqueObservableType) => void) => {
        if (!callback) {
            return;
        }

        this.callback = callback;
        this.startObservable();
    }

    public unsubscribe = () => {
        this.emittersArray.forEach((emitter) => emitter.stop);
        this.emittersArray = [];

        for (const [, timerId] of Object.entries(this.timerDict)) {
            if (timerId) {
                clearTimeout(timerId);
            }
        }
    }

    private startObservable = () => {
        this.startSystemEmitter(SystemType.Temperature);
        this.startSystemEmitter(SystemType.AirPressure);
        this.startSystemEmitter(SystemType.Humidity);
    }

    private startSystemEmitter = (type: symbol) => {
        const emitter = new SystemEmitter(type, (value) => this.onEmitterEvent(type, value));
        emitter.start();

        this.emittersArray.push(emitter);
    }

    private onEmitterEvent = (type: symbol, value: string) => {
        const timerId = this.timerDict[type.toString()];

        if (timerId) {
            clearTimeout(timerId);
        }

        this.timerDict[type.toString()] = setTimeout(() => {
            this.updateAndSendResult(type, 'N/A');
        }, 1000);

        this.updateAndSendResult(type, value);
    }

    private updateResult = (type: symbol, value: string) => {
        switch (type) {
            case SystemType.Temperature: this.result.temperature = value; break;
            case SystemType.Humidity: this.result.humidity = value; break;
            case SystemType.AirPressure: this.result.airPressure = value; break;
        }
    }

    private updateAndSendResult = (type: symbol, value: string): void => {
        this.updateResult(type, value);

        if (Object.keys(this.result).length < 3) {
            return;
        }

        const currentDate = new Date().getTime();

        if (currentDate - this.lastSentDate < 100) {
            return;
        }

        this.callback({ ...this.result });

        this.lastSentDate = currentDate;
    }
}

export default UniqueObservable;