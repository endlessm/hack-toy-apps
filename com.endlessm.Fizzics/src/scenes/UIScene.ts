import { LevelBarView } from "../views/ui/LevelBarView";
import { ToolsBarView } from "../views/ui/ToolsBarView";
import { AbstractScene } from "./AbstractScene";

export class UIScene extends AbstractScene {
  private _levelBarView: LevelBarView;
  private _toolsBarView: ToolsBarView;

  public build(): void {
    this._buildLevelBar();
    this._buildToolsBar();
  }

  private _buildLevelBar(): void {
    this.add.existing((this._levelBarView = new LevelBarView(this)));
  }
  private _buildToolsBar(): void {
    this.add.existing((this._toolsBarView = new ToolsBarView(this)));
  }
}
