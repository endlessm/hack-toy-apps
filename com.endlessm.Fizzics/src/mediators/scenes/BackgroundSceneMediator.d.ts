import { Facade } from "@koreez/mvcx";
import { BackgroundScene } from "../../scenes/BackgroundScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";
export declare class BackgroundSceneMediator extends AbstractSceneMediator<BackgroundScene> {
    constructor();
    onRegister(facade: Facade): void;
    onSceneReady(): void;
    private _onGameStateUpdate;
    private _onLevelBgUpdate;
}
