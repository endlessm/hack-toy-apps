import { BallType } from "../../constants/types";
import { MatterImage } from "../../utils/MatterImage";
export declare class BallView extends MatterImage {
    readonly id: number;
    readonly species: BallType;
    private _hover;
    constructor(scene: Phaser.Scene, id: number, species: BallType, x: number, y: number);
    updateTexture(imageIndex: number): void;
    updateRadius(radius: number): void;
    updateGravity(gravityScale: number): void;
    updateBounce(bounce: number): void;
    updateFriction(friction: number): void;
    updateFrozen(frozen: boolean): void;
    updateCollisionGroup(collisionGroup: number): void;
    private _onPointerOver;
    private _onPointerOut;
    readonly hover: boolean;
}
