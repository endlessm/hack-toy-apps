import { Ticker } from "../utils/Ticker";
import { AbstractScene } from "./AbstractScene";
export declare class GameScene extends AbstractScene {
    private _levelView;
    private readonly _ticker;
    private _flinger;
    get ticker(): Ticker;
    build(): void;
    buildLevel(): void;
    destroyLevel(): void;
    update(time: number, delta: number): void;
}
