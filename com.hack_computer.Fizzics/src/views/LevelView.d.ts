import { BallType } from "../constants/types";
import { BallVO } from "../models/BallVO";
import { BallsMap } from "../utils/BallsMap";
import { BallView } from "./balls/BallView";
import { DynamicContainer } from "./dynamics/DynamicContainer";
export declare class LevelView extends DynamicContainer {
    balls: BallsMap<number, BallView>;
    constructor(scene: Phaser.Scene);
    build(balls: BallVO[]): void;
    getBall(id: number): BallView;
    updateTypeRadius(ballType: BallType, value: number): void;
    updateTypeGravity(ballType: BallType, value: number): void;
    updateTypeBounce(ballType: BallType, value: number): void;
    updateTypeFriction(ballType: BallType, value: number): void;
    updateTypeFrozen(ballType: BallType, value: boolean): void;
    updateTypeFrameIndex(ballType: BallType, value: number): void;
    removeBall(id: number): BallView;
    addBall(id: number, species: BallType, x: number, y: number): BallView;
    updateBallFrozen(ballID: number, value: boolean): void;
    updateBallCollisionGroup(ballID: number, value: number): void;
    onBallFlingableUpdate(ballID: BallType, frozen: boolean): void;
    bringBallToTop(ballID: number): void;
    private _destroyBall;
}
