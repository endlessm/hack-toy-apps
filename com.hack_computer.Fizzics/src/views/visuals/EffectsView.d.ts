export declare class EffectsView extends Phaser.GameObjects.Container {
    constructor();
    private _activeTween;
    cleanup(): void;
    show(position: Phaser.Geom.Point, frame: string, scale?: number): void;
    private readonly _onTweenComplete;
}
