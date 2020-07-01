import { Proxy } from "@koreez/mvcx";
import { IRawPlayer } from "../constants/types";
import { PlayerVO } from "./PlayerVO";
export declare class PlayerVOProxy extends Proxy<PlayerVO> {
    constructor();
    increaseUnlockedLevelIndex(): void;
    getSavableData(): IRawPlayer;
    sync(data: IRawPlayer): void;
}
