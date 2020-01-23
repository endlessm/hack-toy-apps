declare class Ease {
    readonly In: string;
    readonly Out: string;
    readonly InOut: string;
    constructor(prefix: string);
}
export declare class Easings {
    static readonly Linear: string;
    static readonly Quad: Ease;
    static readonly Cubic: Ease;
    static readonly Quart: Ease;
    static readonly Quint: Ease;
    static readonly Sine: Ease;
    static readonly Expo: Ease;
    static readonly Circ: Ease;
    static readonly Back: Ease;
    static readonly Bounce: Ease;
}
export {};
