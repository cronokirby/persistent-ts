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

type VNode<T> =
    | { leaf: false; nodes: VNode<T>[] }
    | { leaf: true; values: T[] };

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
        return new Vector({ leaf: true, values: Array(BRANCH_SIZE) }, 0, 0);
    }

    public get(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        let shift = this._levelShift;
        let cursor = this._root;
        while (!cursor.leaf) {
            cursor = cursor.nodes[(index >>> shift) & BIT_MASK];
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
            const subIndex = (index >>> shift) & BIT_MASK;
            const next = copyVNode(cursor.nodes[subIndex]);
            cursor.nodes[subIndex] = next;
            cursor = next;
            shift -= BIT_WIDTH;
        }
        cursor.values[index & BIT_MASK] = value;
        return new Vector(base, this._levelShift, this.length);
    }

    public append(value: T): Vector<T> {
        let base: VNode<T>;
        let levelShift = this._levelShift;
        if (isFullBranch(this.length)) {
            base = { leaf: false, nodes: Array(BRANCH_SIZE) };
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
                if (shift === 0) {
                    next = { leaf: true, values: Array(BRANCH_SIZE) };
                } else {
                    next = { leaf: false, nodes: Array(BRANCH_SIZE) };
                }
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
