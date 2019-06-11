import List from './List';

test('List.empty isEmpty', () => {
    const empty = List.empty();
    expect(empty.isEmpty()).toBe(true);
});

test('List.singleton is not Empty', () => {
    const singleton = List.of(1);
    expect(singleton.isEmpty()).toBe(false);
});

test('List.equals works', () => {
    const empty = List.empty<number>();
    const single1 = List.of(1);
    const single2 = List.of(2);
    expect(single1.equals(empty)).toBe(false);
    expect(single1.equals(single2)).toBe(false);
    expect(empty.equals(empty)).toBe(true);
    expect(single1.equals(single1)).toBe(true);
});

test('List.prepend works', () => {
    const single1 = List.of(1);
    const prepend1 = List.empty().prepend(1);
    expect(prepend1.equals(single1)).toBe(true);
    expect(single1.prepend(1).equals(single1)).toBe(false);
});

test('List is iterable', () => {
    const array = [1, 2, 3];
    const list = List.of(...array);
    expect(Array.from(list)).toEqual(array);
    expect(Array.from(List.empty())).toEqual([]);
    expect(List.of(...list).equals(list)).toBe(true);
});

test('List.head works', () => {
    expect(List.empty().head()).toBe(null);
    expect(List.of(1).head()).toBe(1);
});

test('List.tail works', () => {
    const empty = List.empty();
    expect(empty.tail().equals(empty)).toBe(true);
});

test('List.take works', () => {
    const empty = List.empty<number>();
    const simple = List.of(1, 2, 3);
    expect(simple.take(0).equals(empty)).toBe(true);
    expect(simple.take(0).equals(simple)).toBe(false);
    expect(simple.take(3).equals(simple)).toBe(true);
    expect(simple.take(1).equals(List.of(1))).toBe(true);
});

test('List.drop works', () => {
    const empty = List.empty<number>();
    expect(empty.drop(0).equals(empty)).toBe(true);
    expect(empty.drop(1).equals(empty)).toBe(true);
    const simple = List.of(1, 2, 3);
    expect(simple.drop(3).equals(empty)).toBe(true);
    expect(simple.drop(1).equals(List.of(2, 3))).toBe(true);
});
