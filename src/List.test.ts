import List from './List';

test('List.empty isEmpty', () => {
    const empty = List.empty();
    expect(empty.isEmpty()).toBe(true);
});

test('List.singleton is not Empty', () => {
    const singleton = List.singleton(1);
    expect(singleton.isEmpty()).toBe(false);
});

test('List.equals', () => {
    const empty: List<number> = List.empty();
    const single1 = List.singleton(1);
    const single2 = List.singleton(2);
    expect(single1.equals(empty)).toBe(false);
    expect(single1.equals(single2)).toBe(false);
    expect(empty.equals(empty)).toBe(true);
    expect(single1.equals(single1)).toBe(true);
});
