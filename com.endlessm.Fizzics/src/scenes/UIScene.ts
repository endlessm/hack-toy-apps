import { LevelBar } from "../views/ui/LevelBar";
import { ToolsBar } from "../views/ui/ToolsBar";
import { AbstractScene } from "./AbstractScene";

export class UIScene extends AbstractScene {
  private _levelBar: LevelBar;
  private _toolsBar: ToolsBar;

  public build(): void {
    this._buildLevelSwitcher();
  }

  private _buildLevelSwitcher(): void {
    this.add.existing((this._levelBar = new LevelBar(this)));
    this.add.existing((this._toolsBar = new ToolsBar(this)));
  }
}
