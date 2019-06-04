import { Facade } from "@koreez/mvcx";
import { GameScene } from "../../scenes/GameScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";
export declare class GameSceneMediator extends AbstractSceneMediator<GameScene> {
    constructor();
    onRegister(facade: Facade): void;
    onSceneReady(): void;
    private _onGameStateUpdate;
    private _onLevelRemove;
    private _onLevelCreate;
    private _onSceneDown;
    private _onSceneUp;
    private _onCanvasOut;
}
