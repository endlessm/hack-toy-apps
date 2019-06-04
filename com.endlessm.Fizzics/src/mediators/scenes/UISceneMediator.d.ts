import { Facade } from "@koreez/mvcx";
import { UIScene } from "../../scenes/UIScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";
export declare class UISceneMediator extends AbstractSceneMediator<UIScene> {
    constructor();
    onRegister(facade: Facade): void;
    onSceneReady(): void;
    private _onGameStateUpdate;
}
