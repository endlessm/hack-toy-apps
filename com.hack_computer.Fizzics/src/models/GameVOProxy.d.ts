import { Proxy } from "@koreez/mvcx";
import { GameState } from "../constants/types";
import { GameVO } from "./GameVO";
export declare class GameVOProxy extends Proxy<GameVO> {
    constructor();
    initialize(): void;
    updateState(state: GameState): void;
}
