import fc from 'fast-check';
import Vector from './Vector';

test('Vector.empty has a length of 0', () => {
    const empty = Vector.empty<void>();
    expect(empty.length).toBe(0);
});

test('Vector.append increments the length', () => {
    const empty = Vector.empty<number>();
    expect(empty.append(1).length).toBe(1);
    expect(empty.append(1).append(2).length).toBe(2);
});

test('Vector.append works with many elements', () => {
    let acc = Vector.empty<number>();
    const times = 1025;
    for (let i = 0; i < times; ++i) {
        acc = acc.append(i);
    }
    expect(acc.length).toBe(times);
    for (let i = 0; i < times; ++i) {
        expect(acc.get(i)).toBe(i);
    }
});

test('Vector.get works', () => {
    const element = 1;
    const empty = Vector.empty<number>();
    const single = empty.append(element);
    expect(single.get(-1)).toBe(null);
    expect(single.get(1)).toBe(null);
    expect(empty.get(0)).toBe(null);
    expect(single.get(0)).toBe(element);
});

test('Vector.set works', () => {
    const a = 0;
    const b = 1;
    const empty = Vector.empty<number>();
    const single = empty.append(a);
    expect(single.set(0, b).get(0)).toBe(b);
});

test('Vector.pop works with many elements', () => {
    let acc = Vector.empty<number>();
    expect(acc.pop()).toEqual(acc);
    const times = 1025;
    for (let i = 0; i < 2 * times; ++i) {
        acc = acc.append(i);
    }
    for (let i = 0; i < times; ++i) {
        acc = acc.pop();
    }
    expect(acc.length).toBe(times);
    for (let i = 0; i < times; ++i) {
        const g = acc.get(i);
        expect(g).toBe(i);
    }
});

test('A Vector created from an array will spread to the same array', () => {
    fc.assert(
        fc.property(fc.array(fc.integer()), data => {
            let acc = Vector.empty<number>();
            for (let d of data) acc = acc.append(d);
            const arr = [...acc];
            expect(arr).toEqual(data);
        })
    );
});
