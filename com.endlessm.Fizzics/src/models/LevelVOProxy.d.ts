import { Facade, Proxy } from "@koreez/mvcx";
import { IRawLevel, LevelState } from "../constants/types";
import { LevelVO } from "./LevelVO";
export declare class LevelVOProxy extends Proxy<LevelVO> {
    initialize(levelIndex: number, rawLevel: IRawLevel): void;
    onRegister(facade: Facade): void;
    onRemove(): void;
    updateState(state: LevelState): void;
    updateDiamonds(increment: number): void;
    updateFlings(value: number): void;
    updateBackground(value: number): void;
    updateScore(value: number): void;
}
