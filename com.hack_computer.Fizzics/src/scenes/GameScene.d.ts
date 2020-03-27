import { Ticker } from "../utils/Ticker";
import { FlingerView } from "../views/balls/FlingerView";
import { LevelView } from "../views/LevelView";
import { AbstractScene } from "./AbstractScene";
export declare class GameScene extends AbstractScene {
    private _levelView;
    private readonly _ticker;
    private _flinger;
    readonly ticker: Ticker;
    build(): void;
    buildLevel(): void;
    destroyLevel(): void;
    update(time: number, delta: number): void;
    readonly flingerView: FlingerView;
    readonly levelView: LevelView;
}
