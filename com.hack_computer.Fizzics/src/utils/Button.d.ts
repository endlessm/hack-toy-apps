import { IButtonConfig } from "../constants/types";
export declare class Button extends Phaser.GameObjects.Image {
    protected config: IButtonConfig;
    constructor(scene: Phaser.Scene, config: IButtonConfig);
    enable(): void;
    disable(): void;
    protected onOver(): void;
    protected onOut(): void;
    protected onUp(): void;
}
