import List from './List';

test('List.empty isEmpty', () => {
    const empty = List.empty();
    expect(empty.isEmpty()).toBe(true);
});
