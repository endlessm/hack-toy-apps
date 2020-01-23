export class BallsMap<K, V> {
  constructor() {
    this._keys = [];
    this._values = [];
    this._typedValues = [[], [], [], [], []];
    this._typedKeys = [[], [], [], [], []];
  }

  private _keys: K[];

  private _values: V[];

  private _typedValues: V[][];

  private _typedKeys: K[][];

  public get size(): number {
    return this._keys.length;
  }

  public get values(): V[] {
    return this._values;
  }

  public get keys(): K[] {
    return this._keys;
  }

  public get types(): V[][] {
    return this._typedValues;
  }

  public getValuesByType(t: number): V[] {
    return this._typedValues[t];
  }

  public getKeysByType(t: number): K[] {
    return this._typedKeys[t];
  }

  // tslint:disable-next-line: no-reserved-keywords
  public set(key: K, value: V): void {
    this._values.push(value);
    this._keys.push(key);
    //@ts-ignore
    this._typedValues[value.species].push(value);
    //@ts-ignore
    this._typedKeys[value.species].push(key);
  }

  // tslint:disable-next-line: no-reserved-keywords
  public get(key: K): V {
    return this._values[this._keys.indexOf(key)];
  }

  public clear(): void {
    this._keys = [];
    this._values = [];
    this._typedValues = [[], [], [], [], []];
    this._typedKeys = [[], [], [], [], []];
  }

  public remove(key: K): V {
    const index = this._keys.indexOf(key);
    const value = this._values[index];
    this._keys.splice(index, 1);
    this._values.splice(index, 1);

    //@ts-ignore
    const typedValues = this._typedValues[value.species];
    typedValues.splice(typedValues.indexOf(value), 1);

    //@ts-ignore
    const typedKeys = this._typedKeys[value.species];
    typedKeys.splice(typedKeys.indexOf(key), 1);

    return value
  }
}
