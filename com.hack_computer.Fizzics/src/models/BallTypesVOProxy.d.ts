import { Proxy } from "@koreez/mvcx";
import { BallType } from "../constants/types";
import { BallTypeVO } from "./BallTypeVO";
export declare class BallTypesVOProxy extends Proxy<Map<BallType, BallTypeVO>> {
    initialize(): void;
    getTypeConfig(ballType: BallType): BallTypeVO;
    updateRadius(ballType: BallType, value: number): void;
    updateGravity(ballType: BallType, value: number): void;
    updateCollision(ballType: BallType, value: number): void;
    updateFriction(ballType: BallType, value: number): void;
    usePhysics(ballType: BallType, value: boolean): void;
    updateDeathVisualGood(ballType: BallType, value: number): void;
    updateDeathVisualBad(ballType: BallType, value: number): void;
    updateDeathSoundGood(ballType: BallType, value: number): void;
    updateDeathSoundBad(ballType: BallType, value: number): void;
    updateImageIndex(ballType: BallType, value: number): void;
    private _initializeBallTypes;
}
