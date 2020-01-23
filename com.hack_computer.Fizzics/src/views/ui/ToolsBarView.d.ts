import { ToolType } from "../../constants/types";
import { DynamicNavigation } from "../dynamics/DynamicNavigation";
export declare class ToolsBarView extends DynamicNavigation<ToolType> {
    constructor(scene: Phaser.Scene);
    build(): void;
}
