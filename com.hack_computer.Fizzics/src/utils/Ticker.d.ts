export declare class Ticker {
    private readonly _actors;
    readonly actors: Set<(time: number, delta: number) => void>;
    add(fn: (time: number, delta: number) => void): void;
    remove(fn: (time: number, delta: number) => void): void;
    update(time: number, delta: number): void;
}
