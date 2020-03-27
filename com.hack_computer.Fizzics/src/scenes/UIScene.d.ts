import { LevelBarView } from "../views/ui/LevelBarView";
import { ToolsBarView } from "../views/ui/ToolsBarView";
import { AbstractScene } from "./AbstractScene";
export declare class UIScene extends AbstractScene {
    private _levelBarView;
    private _toolsBarView;
    build(): void;
    private _buildLevelBar;
    private _buildToolsBar;
    readonly levelBarView: LevelBarView;
    readonly toolsBarView: ToolsBarView;
}
