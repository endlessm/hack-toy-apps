import { Proxy } from "@koreez/mvcx";
import { BallType, IRawBall } from "../constants/types";
import { BallsMap } from "../utils/BallsMap";
import { BallVO } from "./BallVO";
export declare class BallsVOProxy extends Proxy<BallsMap<number, BallVO>> {
    initialize(rawBalls: IRawBall[]): void;
    getBall(ballID: number): BallVO;
    createBall(x: number, y: number, ballType: BallType, id: number): BallVO;
    removeBall(id: number): BallVO;
    switchBallDrag(id: number, enable: boolean): void;
    switchBallFling(id: number, enable: boolean): void;
    updateBallCollisionGroup(id: number, value: number): void;
    private _addBall;
    private _initializeBalls;
}
