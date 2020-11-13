import '@testing-library/jest-dom/extend-expect';
import SystemEmitter from '../System/SystemEmitter';
import { SystemType } from '../Models/MonitoringSystem';

test('SystemEmitter: return value is defined and not null', (done) => {
    const callback = (value: string) => {
        emitter.stop();
        expect(value).toBeDefined();
        expect(value).not.toBeNull();
        done();
    }
    const emitter = new SystemEmitter(SystemType.Temperature, callback);
    emitter.start();
});

test('SystemEmitter: time between messages should be 100-2000 ms', (done) => {
    const callback = () => {
        emitter.stop();
        const endTime = new Date().getTime();
        const delay = endTime - startTime;
        expect(delay).toBeLessThanOrEqual(2000);
        expect(delay).toBeGreaterThanOrEqual(100);
        done();
    }
    const emitter = new SystemEmitter(SystemType.Humidity, callback);
    const startTime = new Date().getTime();
    emitter.start();
});

test('SystemEmitter: after stop there shouldn`t be any message', (done) => {
    let timerId: number | null = null;

    const callback = () => {
        if (timerId) {
            clearTimeout(timerId);
        }

        throw new Error("Test failed. You shouldn't be here. Emitter didn't stop for some reason");
    }

    const emitter = new SystemEmitter(SystemType.AirPressure, callback);
    emitter.start();

    setTimeout(() => {
        emitter.stop();

        timerId = setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 2000);
    }, 90);
});