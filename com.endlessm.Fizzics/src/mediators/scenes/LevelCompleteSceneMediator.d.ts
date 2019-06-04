import { LevelCompleteScene } from "../../scenes/LevelCompleteScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";
export declare class LevelCompleteSceneMediator extends AbstractSceneMediator<LevelCompleteScene> {
    constructor();
    onSceneReady(): void;
    private _onLevelStateUpdate;
    private _onBallTypeImageUpdate;
    private _onDiamondsUpdate;
    private _onFlingsUpdate;
    private _onScoreUpdate;
    private _onNexClick;
}
