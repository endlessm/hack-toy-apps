import { Mediator } from "@koreez/mvcx";
import { AbstractScene } from "../../scenes/AbstractScene";
export declare class AbstractSceneMediator<T extends AbstractScene> extends Mediator<T> {
    setView(view: T): void;
    protected onSceneStart(): void;
    protected onSceneReady(): void;
    protected onSceneWake(): void;
    protected onSceneSleep(): void;
    protected onSceneRemove(): void;
}
