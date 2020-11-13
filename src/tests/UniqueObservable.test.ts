import '@testing-library/jest-dom/extend-expect';
import UniqueObservable, { UniqueObservableType } from '../Observable/UniqueObservable';

test('UniqueObservableType visible object should have 3 fields', (done) => {
    const uniqueObservable = new UniqueObservable();
    uniqueObservable.subscribe((value: UniqueObservableType) => {
        uniqueObservable.unsubscribe();
        expect(Object.keys(value).length).toBe(3);
        done();
    })
});

test('UniqueObservableType: emit object only when all systems sent a value', (done) => {
    const uniqueObservable = new UniqueObservable();
    let undefinedExists = false;

    uniqueObservable.subscribe((value: UniqueObservableType) => {
        uniqueObservable.unsubscribe();

        for (const [, valueField] of Object.entries(value)) {
            if (!valueField) {
                undefinedExists = true;
                break;
            }
        }

        if (!undefinedExists) {
            done();
        } else {
            throw new Error("Test failed. You shouldn't be here. for some reason one of the field is empty");
        }
    })
});

test('UniqueObservableType visible object should have field N/A if there was no message more than 1000 ms', (done) => {
    const uniqueObservable = new UniqueObservable();
    const mockMath = Object.create(global.Math);
    let count = 0;
    mockMath.floor = () => 1500;
    global.Math = mockMath;
    let naExists = false;

    uniqueObservable.subscribe((value: UniqueObservableType) => {
        if (++count > 1) {
            uniqueObservable.unsubscribe();

            for (const [, valueField] of Object.entries(value)) {
                if (valueField === 'N/A') {
                    naExists = true;
                    break;
                }
            }

            if (naExists) {
                done();
            } else {
                throw new Error("Test failed. You shouldn't be here. visible object didn't have field with N/A for some reason");
            }
        }
    })
});