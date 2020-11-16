import '@testing-library/jest-dom/extend-expect';
import { take } from 'rxjs/operators';
import uniqueObservable$, { UniqueObservableType } from '../Observable/UniqueObservable';

test('UniqueObservableType visible object should have 3 fields', (done) => {
    uniqueObservable$.pipe(take(1)).subscribe((value: UniqueObservableType) => {
        expect(Object.keys(value).length).toBe(3);
        done();
    })
});

test('UniqueObservableType: emit object only when all systems sent a value', (done) => {
    let undefinedExists = false;

    uniqueObservable$.pipe(take(1)).subscribe((value: UniqueObservableType) => {
        for (const [, valueField] of Object.entries(value)) {
            if (!valueField) {
                undefinedExists = true;
                break;
            }
        }

        expect(undefinedExists).not.toBeTruthy();
        done();
    })
});

test('UniqueObservableType visible object should have field N/A if there was no message more than 1000 ms', (done) => {
    const mockMath = Object.create(global.Math);
    mockMath.floor = () => 1500;
    global.Math = mockMath;
    let naExists = false;

    uniqueObservable$.pipe(take(2)).subscribe((value: UniqueObservableType) => {
        for (const [, valueField] of Object.entries(value)) {
            if (valueField === 'N/A') {
                naExists = true;
                break;
            }
        }

        expect(naExists).toBeTruthy();
        done();
    })
});