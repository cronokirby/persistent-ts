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
        return null;
    }

    public set(index: number, value: T): Vector<T> {
        return this;
    }

    public append(value: T): Vector<T> {
        return this;
    }
}
export default Vector;
