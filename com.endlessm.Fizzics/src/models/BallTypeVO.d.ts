import { BallType, IBallTypeConfig } from "../constants/types";
export declare class BallTypeVO implements IBallTypeConfig {
    radius: number;
    gravity: number;
    friction: number;
    frameIndex: number;
    bounce: number;
    visualGood: number;
    visualBad: number;
    soundGood: number;
    soundBad: number;
    frozen: boolean;
    createSound: number;
    deleteSound: number;
    flySound: number;
    successSound: number;
    toolSound: number;
    socialForce_0: number;
    socialForce_1: number;
    socialForce_2: number;
    socialForce_3: number;
    socialForce_4: number;
    touchDeath_0: number;
    touchDeath_1: number;
    touchDeath_2: number;
    touchDeath_3: number;
    touchDeath_4: number;
    constructor(ballType: BallType);
}
