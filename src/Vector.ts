type VNode<T> =
    | { leaf: false; nodes: VNode<T>[] }
    | { leaf: true; values: T[] };

class Vector<T> {
    private constructor(
        private readonly _root: VNode<T>,
        public readonly length: number
    ) {}

    public static empty<T>(): Vector<T> {
        return new Vector({ leaf: true, values: [] }, 0);
    }

    public get(index: number): T | null {
        if (index < 0 || index >= this.length) return null;
        if (!this._root.leaf) return null;
        return this._root.values[index];
    }

    public set(index: number, value: T): Vector<T> {
        return this;
    }

    public append(value: T): Vector<T> {
        const values = this._root.leaf ? [...this._root.values] : [];
        values.push(value);
        return new Vector({leaf: true, values}, this.length + 1);
    }
}
export default Vector;
