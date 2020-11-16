import { combineLatest, interval, Observable, of, race } from "rxjs";
import { catchError, map, repeat, retry, retryWhen, shareReplay, switchMap, tap, timeout } from 'rxjs/operators';
import { SystemType } from "../Models/MonitoringSystem";
import SystemEmitter from "../System/SystemEmitter";

export type UniqueObservableType = {
    temperature: string,
    airPressure: string,
    humidity: string
}

const startSystemEmitter = (type: symbol) => {
    return new Observable<string>((subscriber) => {
            const emitter = new SystemEmitter(type, (value) => subscriber.next(value));
            emitter.start();
    
            return () => {
                emitter.stop();
                subscriber.unsubscribe();
            }
        }).pipe(
            timeout(1000),
            catchError(() => of('N/A')),
            repeat())
}

const uniqueObservable$ : Observable<UniqueObservableType> = combineLatest(
        startSystemEmitter(SystemType.Temperature),
        startSystemEmitter(SystemType.AirPressure),
        startSystemEmitter(SystemType.Humidity))
    .pipe(
        map(([temperature, airPressure, humidity]) => ({
            temperature,
            airPressure,
            humidity
        })));

export default uniqueObservable$;