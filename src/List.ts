type Node<T> = { empty: true } | { empty: false; value: T; next: Node<T> };
// We can share a single empty node between all lists.
const EMPTY_NODE = { empty: true };

class List<T> implements Iterable<T> {
    private constructor(private readonly _node: Node<T>) {}

    public static empty<T>(): List<T> {
        return new List(EMPTY_NODE as Node<T>);
    }

    public static from<T>(...values: T[]): List<T> {
        let ret = List.empty<T>();
        for (let i = values.length - 1; i >= 0; --i) {
            ret = ret.prepend(values[i]);
        }
        return ret;
    }

    public isEmpty(): boolean {
        return this._node.empty;
    }

    public prepend(value: T): List<T> {
        return new List({ empty: false, value, next: this._node });
    }

    public *[Symbol.iterator]() {
        let node = this._node;
        while (!node.empty) {
            yield node.value;
            node = node.next;
        }
    }

    public equals(that: List<T>): boolean {
        let thisNode = this._node;
        let thatNode = that._node;
        while (!thisNode.empty) {
            if (thatNode.empty) return false;
            if (thisNode.value !== thatNode.value) return false;
            thisNode = thisNode.next;
            thatNode = thatNode.next;
        }
        return thatNode.empty;
    }
}
export default List;
