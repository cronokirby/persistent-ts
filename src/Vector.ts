const BIT_WIDTH = 5;
const BIT_MASK = 0b11111;
const BRANCH_SIZE = 1 << BIT_WIDTH;

function isFullBranch(length: number) {
    return (
        length === 1 << 5 ||
        length === 1 << 10 ||
        length === 1 << 15 ||
        length === 1 << 20 ||
        length === 1 << 25 ||
        length === 1 << 30
    );
}

interface VLeaf<T> {
    leaf: true;
    values: T[];
}
interface VBranch<T> {
    leaf: false;
    // We have explicit nulls because when popping we can null old branches on purpose.
    nodes: (VNode<T> | null)[];
}
type VNode<T> = VLeaf<T> | VBranch<T>;

function emptyBranch<T>(): VBranch<T> {
    return { leaf: false, nodes: Array(BRANCH_SIZE).fill(null) };
}

function emptyLeaf<T>(): VLeaf<T> {
    return { leaf: true, values: Array(BRANCH_SIZE).fill(null) };
}

function copyVNode<T>(vnode: VNode<T>): VNode<T> {
    if (vnode.leaf) {
        return { leaf: true, values: [...vnode.values] };
    } else {
        return { leaf: false, nodes: [...vnode.nodes] };
    }
}

class Vector<T> {
    private constructor(
        private readonly _root: VNode<T>,
        private readonly _levelShift: number,
        public readonly length: number
    ) {}

    /**
     * Create an empty vector of a certain type.
     */
    public static empty<T>(): Vector<T> {
        return new Vector(emptyLeaf(), 0, 0);
    }

    /**
     * O(log_32(N)) Return the value at a certain index, if it exists.
     *
     * This returns null if the index is out of the vector's bounds.
     *
     * @param index the index to look up
     */
    public get(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        let shift = this._levelShift;
        let cursor = this._root;
        while (!cursor.leaf) {
            // This cast is fine because we checked the length prior
            cursor = cursor.nodes[(index >>> shift) & BIT_MASK] as VNode<T>;
            shift -= BIT_WIDTH;
        }
        return cursor.values[index & BIT_MASK];
    }

    /**
     * O(log_32(N)) Return a new vector with an element set to a new value.
     *
     * This will do nothing if the index is negative, or out of the bounds of the vector.
     *
     * @param index the index to set
     * @param value the value to set at that index
     */
    public set(index: number, value: T): Vector<T> {
        if (index < 0 || index >= this.length) return this;
        const base = copyVNode(this._root);
        let shift = this._levelShift;
        let cursor = base;
        while (!cursor.leaf) {
            const subIndex = (index >>> shift) & BIT_MASK;
            // This cast is fine because we checked the length prior
            const next = copyVNode(cursor.nodes[subIndex] as VNode<T>);
            cursor.nodes[subIndex] = next;
            cursor = next;
            shift -= BIT_WIDTH;
        }
        cursor.values[index & BIT_MASK] = value;
        return new Vector(base, this._levelShift, this.length);
    }

    /**
     * O(log_32(N)) Append a value to the end of this vector.
     *
     * This is useful for building up a vector from values.
     *
     * @param value the value to push to the end of the vector
     */
    public append(value: T): Vector<T> {
        let base: VNode<T>;
        let levelShift = this._levelShift;
        if (isFullBranch(this.length)) {
            base = emptyBranch();
            base.nodes[0] = this._root;
            levelShift += 5;
        } else {
            base = copyVNode(this._root);
        }
        let index = this.length;
        let shift = levelShift;
        let cursor = base;
        while (!cursor.leaf) {
            const subIndex = (index >>> shift) & BIT_MASK;
            shift -= BIT_WIDTH;
            let next = cursor.nodes[subIndex];
            if (!next) {
                next = shift === 0 ? emptyLeaf() : emptyBranch();
            } else {
                next = copyVNode(next);
            }
            cursor.nodes[subIndex] = next;
            cursor = next;
        }
        cursor.values[index & BIT_MASK] = value;
        return new Vector(base, levelShift, this.length + 1);
    }
}
export default Vector;
