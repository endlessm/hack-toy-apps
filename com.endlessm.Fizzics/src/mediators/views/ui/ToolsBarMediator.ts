import { inject, injectable } from "@robotlegsjs/core";
import { ToolType } from "../../../constants/types";
import { LevelModel } from "../../../models/playable/LevelModel";
import { PlayableModel } from "../../../models/playable/PlayableModel";
import { ToolVO } from "../../../models/playable/ToolVO";
import { ToolSwitchSignal } from "../../../signals/ToolSwitchSignal";
import { ToolsBar } from "../../../views/ui/ToolsBar";
import { AbstractViewMediator } from "../../AbstractViewMediator";

@injectable()
export class ToolsBarMediator extends AbstractViewMediator<ToolsBar> {
  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  @inject(ToolSwitchSignal)
  private readonly _toolSwitchSignal: ToolSwitchSignal;

  public initialize(): void {
    super.initialize();

    this.view.build();

    this.view.on("toolClick", this._onToolClick, this);
    this.view.setPosition(45, 45);

    this.addReaction(() => this._playableModel.level, this._onNewLevelReady);
  }

  private _onNewLevelReady(level: LevelModel): void {
    this.removeAllReactions();

    level.toolsModel.tools.forEach((toolVO: ToolVO) => {
      this.addReaction(
        () => toolVO.enabled,
        this._updateToolEnable.bind(this, toolVO),
        { fireImmediately: true }
      );
      this.addReaction(
        () => toolVO.inUse,
        this._updateToolInUse.bind(this, toolVO),
        { fireImmediately: true }
      );
    });

    this.addReaction(() => this._playableModel.level, this._onNewLevelReady);
    this.addReaction(
      () => this._playableModel.level.toolsModel.activeToolType,
      this._updateActiveTool,
      {
        fireImmediately: true
      }
    );
  }

  private _updateToolEnable(toolVO: ToolVO, enabled: boolean): void {
    this.view.updateToolEnable(toolVO.type, enabled);
  }

  private _updateToolInUse(toolVO: ToolVO, inUse: boolean): void {
    this.view.updateToolInUse(toolVO.type, inUse);
  }

  private _updateActiveTool(state: ToolType): void {
    this.view.updateActiveTool(state);
  }

  private _onToolClick(toolType: ToolType): void {
    this._toolSwitchSignal.dispatch(toolType);
  }
}
