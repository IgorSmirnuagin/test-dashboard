import { combineLatest, iif, interval, Observable, of } from "rxjs";
import { catchError, map, mergeMap, pairwise, repeat, switchMap, tap, timeInterval, timeout } from 'rxjs/operators';
import { SystemType } from "../Models/MonitoringSystem";
import SystemEmitter from "../System/SystemEmitter";

export type UniqueObservableType = {
    temperature: string,
    airPressure: string,
    humidity: string
}

const startSystemEmitter = (type: symbol) => {
    return combineLatest([new Observable<string>((subscriber) => {
        const emitter = new SystemEmitter(type, (value) => subscriber.next(value));
        emitter.start();

        return () => {
            emitter.stop();
            subscriber.unsubscribe();
        }
    }), interval(1000)]).pipe(
        pairwise(),
        timeInterval(),
        mergeMap(r => {
            const { interval } = r;
            const [prevData, prevInterval] = r.value[0];
            const [newData, newInterval] = r.value[1];

            return iif(() =>
                interval > 1000 && interval < 1100 &&
                newInterval === prevInterval + 1 &&
                prevData === newData,
                of('N/A'),
                of(newData));
        }));
}

const uniqueObservable$: Observable<UniqueObservableType> = combineLatest(
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