export declare class BallsMap<K, V> {
    constructor();
    private _keys;
    private _values;
    private _typedValues;
    private _typedKeys;
    readonly size: number;
    readonly values: V[];
    readonly keys: K[];
    readonly types: V[][];
    getValuesByType(t: number): V[];
    getKeysByType(t: number): K[];
    set(key: K, value: V): void;
    get(key: K): V;
    clear(): void;
    remove(key: K): V;
}
