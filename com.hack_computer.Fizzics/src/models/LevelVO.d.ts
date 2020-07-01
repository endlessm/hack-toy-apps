import { LevelState } from "../constants/types";
export declare class LevelVO {
    state: LevelState;
    score: number;
    flings: number;
    diamonds: number;
    backgroundImageIndex: number;
    index: number;
    id: number;
    constructor(ID: number, index: number);
}
