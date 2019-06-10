import List from './List';

test('List.empty isEmpty', () => {
    const empty = List.empty();
    expect(empty.isEmpty()).toBe(true);
});

test('List.singleton is not Empty', () => {
    const singleton = List.from(1);
    expect(singleton.isEmpty()).toBe(false);
});

test('List.equals works', () => {
    const empty: List<number> = List.empty();
    const single1 = List.from(1);
    const single2 = List.from(2);
    expect(single1.equals(empty)).toBe(false);
    expect(single1.equals(single2)).toBe(false);
    expect(empty.equals(empty)).toBe(true);
    expect(single1.equals(single1)).toBe(true);
});

test('List.prepend works', () => {
    const single1 = List.from(1);
    const prepend1 = List.empty().prepend(1);
    expect(prepend1.equals(single1)).toBe(true);
    expect(single1.prepend(1).equals(single1)).toBe(false);
});

test('List is iterable', () => {
    const array = [1, 2, 3];
    const list = List.from(...array);
    expect(Array.from(list)).toEqual(array);
    expect(Array.from(List.empty())).toEqual([]);
    expect(List.from(...list).equals(list)).toBe(true);
});
