import { Facade, Observant } from "@koreez/mvcx";
export declare class SoundObservant extends Observant {
    private _sound;
    private _typesProxy;
    private _levelProxy;
    private _ballsProxy;
    onRegister(facade: Facade): void;
    private _onFlingerStart;
    private _onFlingerEnd;
    private _onFlingerReset;
    private _onFlingerDistanceUpdate;
    private _onLevelStart;
    private _onLevelStateChange;
    private _onLevelSwitch;
    private _onNextLevel;
    private _onBallRemoveByTool;
    private _onBallsMaxCountReached;
    private _onBallDragEnable;
    private _onBallFlingUpdate;
    private _onActiveToolUpdate;
    private _onCreateToolActiveOptionChange;
    private _onBallCreatedByTool;
    private _onWallCollision;
    private _onBombCollision;
    private _onStarCollision;
    private _onDiamondCollision;
    private _onRockCollision;
    private _getTypeConfig;
}
