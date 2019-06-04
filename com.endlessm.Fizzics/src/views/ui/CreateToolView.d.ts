import { Tool } from "./Tool";
export declare class CreateToolView extends Tool {
    constructor(scene: Phaser.Scene);
    private readonly _menu;
    select(): void;
    deselect(): void;
}
