const BIT_WIDTH = 5;
const BIT_MASK = 0b11111;
const BRANCH_SIZE = 1 << BIT_WIDTH;

type VNode<T> =
    | { leaf: false; nodes: VNode<T>[] }
    | { leaf: true; values: T[] };

function emptyLeaf<T>(): VNode<T> {
    return { leaf: true, values: Array(BRANCH_SIZE) };
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

    public static empty<T>(): Vector<T> {
        return new Vector(emptyLeaf(), 0, 0);
    }

    public get(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        let shift = this._levelShift;
        let cursor = this._root;
        while (!cursor.leaf) {
            cursor = cursor.nodes[(index >> shift) & BIT_MASK];
            shift -= BIT_WIDTH;
        }
        return cursor.values[index & BIT_MASK];
    }

    public set(index: number, value: T): Vector<T> {
        if (index < 0 || index >= this.length) return this;
        const base = copyVNode(this._root);
        let shift = this._levelShift;
        let cursor = base;
        while (!cursor.leaf) {
            const subIndex = (index >> shift) & BIT_MASK;
            const next = copyVNode(cursor.nodes[subIndex]);
            cursor.nodes[subIndex] = next;
            shift -= BIT_WIDTH;
        }
        cursor.values[index & BIT_MASK] = value;
        return new Vector(base, this._levelShift, this.length);
    }

    public append(value: T): Vector<T> {
        const base = copyVNode(this._root);
        let index = this.length;
        let shift = this._levelShift;
        let cursor = base;
        while (!cursor.leaf) {
            const subIndex = (index >> shift) & BIT_MASK;
            const next = copyVNode(cursor.nodes[subIndex]);
            cursor.nodes[subIndex] = next;
            shift -= BIT_WIDTH;
        }
        cursor.values[index] = value;
        return new Vector(base, this._levelShift, this.length + 1);
    }
}
export default Vector;
