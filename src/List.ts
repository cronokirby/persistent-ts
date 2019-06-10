type Node<T> = { empty: true } | { empty: false; value: T; next: Node<T> };
// We can share a single empty node between all lists.
const EMPTY_NODE = { empty: true };

class List<T> {
    private constructor(private readonly _node: Node<T>) {}

    public static empty<T>(): List<T> {
        return new List({ empty: true });
    }

    public static singleton<T>(value: T): List<T> {
        const next = EMPTY_NODE as Node<T>;
        return new List({ empty: false, value, next });
    }

    public isEmpty(): boolean {
        return this._node.empty;
    }
}
export default List;
