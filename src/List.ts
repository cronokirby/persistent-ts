type Node<T> = { next: null } | { value: T; next: Node<T> };
// We can share a single empty node between all lists.
const EMPTY_NODE = { next: null };

/**
 * List<T> represents an immutable list containing values of type T.
 *
 * This class is implemented as a singly linked-list, with all the caveats involved.
 *
 * Because a List is Iterable, you can loop over it using `for of` and use the spread operator.
 */
class List<T> implements Iterable<T> {
    private constructor(private readonly _node: Node<T>) {}

    /**
     * Create a new empty list.
     */
    public static empty<T>(): List<T> {
        return new List(EMPTY_NODE as Node<T>);
    }

    /**
     * Create a list from an array of values.
     *
     * @param values an array of values the list will contain, in the same order
     */
    public static of<T>(...values: T[]): List<T> {
        let ret = List.empty<T>();
        for (let i = values.length - 1; i >= 0; --i) {
            ret = ret.prepend(values[i]);
        }
        return ret;
    }

    /**
     * Check whether or not a list is empty.
     *
     * This is equivalent to checking if a list has no elements.
     */
    public isEmpty(): boolean {
        return !this._node.next;
    }

    /**
     * Add a new value to the front of the list.
     *
     * @param value the value to add to the front of the list
     */
    public prepend(value: T): List<T> {
        return new List({ value, next: this._node });
    }

    /**
     * Get the value at the front of the list, if it exists.
     *
     * This function will return null if `isEmpty()` returns
     * true, or if the value at the front of the list happens to be
     * `null`. Because of this, be careful when storing values that might
     * be `null` inside the list, because this function may return `null`
     * even if the list isn't empty.
     */
    public head(): T | null {
        return this._node.next ? this._node.value : null;
    }

    /**
     * Return a list containing the values past the head of the list.
     *
     * For example: `List.of(1, 2).tail()` gives `List.of(2)`.
     *
     * If the list is empty, this method returns an empty list.
     *
     * `l.tail().prepend(l.head())` will always be `l` for any non-empty list `l`.
     */
    public tail(): List<T> {
        return this._node.next ? new List(this._node.next) : this;
    }

    /**
     * Take a certain number of elements from the front of a List.
     *
     * If the amount is 0, and empty list is returned.
     *
     * If the list has less than the amount taken, the entire list is taken.
     *
     * @param amount the number of elements to take from the front of the list
     */
    public take(amount: number): List<T> {
        if (amount === 0 || !this._node.next) return List.empty();
        const base: Node<T> = {
            value: this._node.value,
            next: EMPTY_NODE as Node<T>,
        };
        let latest = base;
        let list = this.tail();
        for (let i = 1; i < amount; ++i) {
            // We check specifically against empty in case a value is null inside a list
            if (list.isEmpty()) break;
            const next: Node<T> = {
                value: list.head() as T,
                next: EMPTY_NODE as Node<T>,
            };
            latest.next = next;
            latest = next;
            list = list.tail();
        }
        return new List(base);
    }

    /**
     * Return a list with `amount` elements removed from the front.
     *
     * If `amount` is greater than or equal to the size of the list,
     * an empty list is returned.
     *
     * `l.drop(1)` is always equal to `l.tail()`.
     *
     * @param amount the number of elements to drop
     */
    public drop(amount: number): List<T> {
        let list: List<T> = this;
        for (let i = 0; i < amount; ++i) {
            list = list.tail();
        }
        return list;
    }

    public *[Symbol.iterator]() {
        let node = this._node;
        while (node.next) {
            yield node.value;
            node = node.next;
        }
    }

    /**
     * Test whether or not a list is logically equal to another.
     *
     * This returns true if the lists have the same size, and each element in a given
     * position is `===` to the element in the same position in the other list.
     *
     * @param that the list to compare for equality with this one.
     */
    public equals(that: List<T>): boolean {
        let thisNode = this._node;
        let thatNode = that._node;
        while (thisNode.next) {
            if (!thatNode.next) return false;
            if (thisNode.value !== thatNode.value) return false;
            thisNode = thisNode.next;
            thatNode = thatNode.next;
        }
        return !thatNode.next;
    }
}
export default List;
