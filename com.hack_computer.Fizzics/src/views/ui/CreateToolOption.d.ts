import { BallType } from "../../constants/types";
import { NavItem } from "./NavItem";
export declare class CreateToolOption extends NavItem<BallType> {
    constructor(scene: Phaser.Scene, t: BallType);
    private _outline;
    get defaultFrame(): string;
    updateBgFrame(frameIndex: number): void;
    select(): void;
    deselect(): void;
    private _createOutline;
}
