import { IRawBall } from "../constants/types";
export declare class BallVO {
    id: number;
    species: number;
    x: number;
    y: number;
    collisionGroup: number;
    flingable: boolean;
    draggable: boolean;
    constructor(rawBall: IRawBall);
}
