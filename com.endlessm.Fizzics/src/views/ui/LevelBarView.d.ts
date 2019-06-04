import { DynamicContainer } from "../dynamics/DynamicContainer";
export declare class LevelBarView extends DynamicContainer {
    constructor(scene: Phaser.Scene);
    private _levelLabel;
    private _diamondLabel;
    private _flingLabel;
    private _prevButton;
    private _nextButton;
    private _retryButton;
    build(): void;
    disablePrevButton(): void;
    disableNextButton(): void;
    enableButtons(): void;
    startResetButtonBlinking(): void;
    stopResetButtonBlinking(): void;
    updateLevelIndex(value: number): void;
    updateDiamonds(value: number): void;
    updateFlings(value: number): void;
    private _onPrevClick;
    private _onNextClick;
    private _onRetryClick;
    private _getCornerBg;
}
