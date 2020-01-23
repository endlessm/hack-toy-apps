export declare class MatterImage extends Phaser.Physics.Matter.Image {
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, texture: string, frame?: string | number, options?: object);
    setBody(config: object, options: object): Phaser.GameObjects.GameObject;
    setGravityScale(value: number): void;
}
