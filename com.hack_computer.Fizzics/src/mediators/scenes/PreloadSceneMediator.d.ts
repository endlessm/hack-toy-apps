import { PreloadScene } from "../../scenes/PreloadScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";
export declare class PreloadSceneMediator extends AbstractSceneMediator<PreloadScene> {
    constructor();
    setView(view: PreloadScene): void;
    protected onSceneReady(): void;
}
