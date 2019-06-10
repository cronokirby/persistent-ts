import List from './List';

test('List.empty isEmpty', () => {
    const empty = List.empty();
    expect(empty.isEmpty()).toBe(true);
});

test('List.singleton is not Empty', () => {
    const singleton = List.singleton(1);
    expect(singleton.isEmpty()).toBe(false);
});
