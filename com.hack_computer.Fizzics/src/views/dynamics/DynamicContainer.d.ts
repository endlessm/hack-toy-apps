export declare class DynamicContainer extends Phaser.GameObjects.Container {
    get uuid(): string;
    constructor(scene: Phaser.Scene, uuid: string);
    private static readonly _consoleArgs;
    private readonly _uuid;
    destroy(): void;
    construct(): void;
    destruct(): void;
}
