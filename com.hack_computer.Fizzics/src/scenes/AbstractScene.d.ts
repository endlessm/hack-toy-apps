import { INinePatchCreator, INinePatchFactory } from "@koreez/phaser3-ninepatch";
export declare abstract class AbstractScene extends Phaser.Scene {
    add: INinePatchFactory;
    make: INinePatchCreator;
    private static readonly _consoleArgs;
    init(): void;
    create(): void;
    logInit(): void;
    logReady(): void;
    logSleep(): void;
    logWake(): void;
    logRemove(): void;
}
