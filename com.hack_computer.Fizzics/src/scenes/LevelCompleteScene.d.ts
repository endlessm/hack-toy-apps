import { AbstractScene } from "./AbstractScene";
export declare class LevelCompleteScene extends AbstractScene {
    private _diamondLabel;
    private _flingLabel;
    private _scoreLabel;
    private _ballImage;
    build(): void;
    updateBallImage(frameIndex: number): void;
    updateScore(value: number): void;
    updateDiamonds(value: number): void;
    updateFlings(value: number): void;
    private _getResultComponent;
    private _createBg;
    private _createBlocker;
    private _createNextButton;
    private _onNextClick;
}
