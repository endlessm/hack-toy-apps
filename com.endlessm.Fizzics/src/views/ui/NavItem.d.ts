export declare abstract class NavItem<T> extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, t: T);
    readonly defaultFrame: string;
    protected bg: Phaser.GameObjects.Image;
    private readonly _t;
    readonly t: T;
    show(): void;
    hide(): void;
    abstract select(): void;
    abstract deselect(): void;
    enable(): void;
    disable(): void;
    protected onDown(): void;
    private _createBg;
}
