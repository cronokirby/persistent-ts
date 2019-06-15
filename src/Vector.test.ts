import Vector from './Vector';

test('Vector.empty has a length of 0', () => {
    const empty = Vector.empty<void>();
    expect(empty.length).toBe(0);
});

test('Vector.append increments the length', () => {
    const empty = Vector.empty<number>();
    expect(empty.append(1).length).toBe(1);
    expect(empty.append(1).append(2).length).toBe(2);
})

test('Vector.get works', () => {
    const element = 1;
    const empty = Vector.empty<number>();
    const single = empty.append(element);
    expect(single.get(-1)).toBe(null);
    expect(single.get(1)).toBe(null);
    expect(empty.get(0)).toBe(null);
    expect(single.get(0)).toBe(element);
});
