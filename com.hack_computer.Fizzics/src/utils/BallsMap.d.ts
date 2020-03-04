export declare class BallsMap<K, V> {
    constructor();
    private _keys;
    private _values;
    private _typedValues;
    private _typedKeys;
    get size(): number;
    get values(): V[];
    get keys(): K[];
    get types(): V[][];
    getValuesByType(t: number): V[];
    getKeysByType(t: number): K[];
    set(key: K, value: V): void;
    get(key: K): V;
    clear(): void;
    remove(key: K): V;
}
