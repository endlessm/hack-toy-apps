import { inject, injectable } from "@robotlegsjs/core";
import { TRANSFORM } from "../../..";
import { LevelState } from "../../../constants/types";
import { LevelModel } from "../../../models/playable/LevelModel";
import { PlayableModel } from "../../../models/playable/PlayableModel";
import { PlayerModel } from "../../../models/PlayerModel";
import { LevelRetrySignal } from "../../../signals/LevelRetrySignal";
import { LevelSwitchSignal } from "../../../signals/LevelSwitchSignal";
import { LevelBar } from "../../../views/ui/LevelBar";
import { AbstractViewMediator } from "../../AbstractViewMediator";

@injectable()
export class LevelBarMediator extends AbstractViewMediator<LevelBar> {
  @inject(PlayableModel)
  private _playableModel: PlayableModel;

  @inject(PlayerModel)
  private _playerModel: PlayerModel;

  @inject(LevelSwitchSignal)
  private _levelSwitchSignal: LevelSwitchSignal;

  @inject(LevelRetrySignal)
  private _levelRetrySignal: LevelRetrySignal;

  public initialize(): void {
    super.initialize();

    this.view.build();

    this.view.on("prevClick", this._onPreviewsLevel, this);
    this.view.on("nextClick", this._onNextLevel, this);
    this.view.on("retryClick", this._onRetryLevel, this);

    this.addReaction(() => this._playableModel.level, this._onNewLevelReady);

    const { x } = TRANSFORM.center;
    this.view.setPosition(x - this.view.width / 2, 4);
  }

  private _onNewLevelReady(level: LevelModel): void {
    this.removeReaction(this._updateDiamondsCount);
    this.removeReaction(this._updateFlingsCount);
    this.removeReaction(this._checkForViewState);

    this.addReaction(() => level.diamonds, this._updateDiamondsCount, { fireImmediately: true });
    this.addReaction(() => level.flings, this._updateFlingsCount, { fireImmediately: true });
    this.addReaction(() => level.state, this._checkForViewState, { fireImmediately: true });

    this._updateLevelIndex(level.index);
  }

  private _updateLevelIndex(value: number): void {
    this.view.updateLevelIndex(value + 1);
    this._checkForButtonsState(value);
  }

  private _updateDiamondsCount(value: number): void {
    this.view.updateDiamonds(value);
  }

  private _updateFlingsCount(value: number): void {
    this.view.updateFlings(value);
  }

  private _checkForViewState(state: LevelState): void {
    switch (state) {
      case LevelState.FAIL:
        this.view.startResetButtonBlinking();
        break;
      default:
        this.view.stopResetButtonBlinking();
        break;
    }
  }

  private _checkForButtonsState(levelIndex: number) {
    this.view.enableButtons();
    if (levelIndex === 0) {
      this.view.disablePrevButton();
    }
    if (levelIndex === this._playerModel.unlockedLevelIndex) {
      this.view.disableNextButton();
    }
  }

  private _onPreviewsLevel(): void {
    this._levelSwitchSignal.dispatch(-1);
  }

  private _onNextLevel(): void {
    this._levelSwitchSignal.dispatch(1);
  }

  private _onRetryLevel(): void {
    this._levelRetrySignal.dispatch();
  }
}
