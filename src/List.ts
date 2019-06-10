type Node<T> = { empty: true } | { empty: false; value: T; next: Node<T> };

class List<T> {
    private constructor(private readonly _node: Node<T>) {}

    isEmpty(): boolean {
        return this._node.empty;
    }

    static empty<T>(): List<T> {
        return new List({ empty: true });
    }
}
export default List;
