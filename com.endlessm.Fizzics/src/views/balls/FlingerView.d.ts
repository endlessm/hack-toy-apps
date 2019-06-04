import { GameScene } from "../../scenes/GameScene";
import { DynamicContainer } from "../dynamics/DynamicContainer";
import { BallView } from "./BallView";
export declare class FlingerView extends DynamicContainer {
    scene: GameScene;
    constructor(scene: Phaser.Scene);
    private static readonly MIN_DISTANCE;
    private static readonly FLING_IMG_DEVIANT;
    private _ball;
    private _fling;
    private _rectPath;
    private _line1;
    private _line2;
    private _line1Arc;
    private _line2Arc;
    private _lineGroup;
    private _minDistanceReached;
    private readonly _flingUpPoint;
    build(): void;
    reset(): void;
    stop(): void;
    start(ballView: BallView): void;
    private _updateLines;
    private _startDistanceCheck;
    private _stopDistanceCheck;
    private readonly _onTick;
    private _createFlingImage;
    private _createComponents;
    private _onFlingOver;
    private _onFlingOut;
    private _onFlingDrag;
    private _onFlingUp;
    private _onFling;
}
