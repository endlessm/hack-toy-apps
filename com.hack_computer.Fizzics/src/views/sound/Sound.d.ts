export declare abstract class AbstractSound {
    abstract play(key: string, loop?: boolean): void;
    abstract stop(key: string): void;
    abstract update(key: string, rate: number): void;
}
export declare class ToyAppSound extends AbstractSound {
    play(key: string, loop?: boolean): void;
    stop(key: string): void;
    update(key: string, rate: number): void;
}
export declare class WebAppSound extends AbstractSound {
    play(key: string, loop?: boolean): void;
    stop(key: string): void;
    update(key: string, rate: number): void;
}
