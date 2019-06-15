import Vector from './Vector';

test('Vector.empty has a length of 0', () => {
    const empty = Vector.empty<void>();
    expect(empty.length).toBe(0);
});
