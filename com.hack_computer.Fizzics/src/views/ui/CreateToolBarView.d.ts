import { BallType } from "../../constants/types";
import { DynamicNavigation } from "../dynamics/DynamicNavigation";
export declare class CreateToolBarView extends DynamicNavigation<BallType> {
    constructor(scene: Phaser.Scene);
    build(): void;
    updateOptionFrame(ballType: BallType, frameIndex: number): void;
    switchVisible(): void;
    show(): void;
    hide(): void;
}
