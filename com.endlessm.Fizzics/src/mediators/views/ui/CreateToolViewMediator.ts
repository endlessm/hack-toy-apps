import { inject, injectable } from "@robotlegsjs/core";
import { BallTypes } from "../../../constants/types";
import { LevelModel } from "../../../models/playable/LevelModel";
import { PlayableModel } from "../../../models/playable/PlayableModel";
import { CreateToolOptionChangeSignal } from "../../../signals/CreateToolOptionChangeSignal";
import { CreateToolView } from "../../../views/ui/CreateToolView";
import { AbstractViewMediator } from "../../AbstractViewMediator";

@injectable()
export class CreateToolViewMediator extends AbstractViewMediator<
  CreateToolView
> {
  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  @inject(CreateToolOptionChangeSignal)
  private readonly _createToolOptionChangeSignal: CreateToolOptionChangeSignal;

  public initialize(): void {
    super.initialize();

    this.view.on("onOptionClick", this._onCreateToolOptionClick, this);
    this.addReaction(() => this._playableModel.level, this._onNewLevelReady);
  }

  private _onNewLevelReady(level: LevelModel): void {
    this.removeAllReactions();
    this.addReaction(() => this._playableModel.level, this._onNewLevelReady);

    const createToolVO = this._playableModel.level.toolsModel.getCreateTool();

    this.addReaction(
      () => createToolVO.activeOption,
      this._updateCreateToolActiveOption,
      { fireImmediately: true }
    );
    // this.addReaction(
    //   //@ts-ignore
    //   () => level.ballTypeConfig.imageIndex,
    //   () => {
    //     console.warn("eka");
    //   },
    //   { fireImmediately: false }
    // );
  }

  private _updateCreateToolActiveOption(option: BallTypes): void {
    this.view.updateActiveOption(option);
  }

  private _onCreateToolOptionClick(option: BallTypes): void {
    this._createToolOptionChangeSignal.dispatch(option);
  }

  // private _updateToolFrame(toolVO: ToolVO, frame: string): void {
  //   // this.view.updateToolFrame(toolVO.type, frame);
  // }
}
