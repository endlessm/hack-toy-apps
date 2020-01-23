import { DynamicMediator, Facade } from "@koreez/mvcx";
import { TRANSFORM } from "../..";
import { GameEvents, LevelEvents, UIEvents } from "../../constants/EventNames";
import { LevelState } from "../../constants/types";
import { LevelVO } from "../../models/LevelVO";
import { PlayerVOProxy } from "../../models/PlayerVOProxy";
import { LevelBarView } from "../../views/ui/LevelBarView";

export class LevelBarViewMediator extends DynamicMediator<LevelBarView> {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    const { x } = TRANSFORM.center;
    this.view.build();
    this.view.on("prevClick", this._onPrevLevel, this);
    this.view.on("nextClick", this._onNextLevel, this);
    this.view.on("retryClick", this._onRetryLevel, this);
    this.view.setPosition(x - this.view.width / 2, 4);

    this._subscribe(LevelEvents.StateUpdate, this._onLevelStateUpdate);
    this._subscribe(LevelEvents.DiamondsUpdate, this._onLevelDiamondsUpdate);
    this._subscribe(LevelEvents.FlingsUpdate, this._onLevelFlingsUpdate);
    this._subscribe(LevelEvents.LevelStart, this._onLevelStart);
  }

  private _onLevelStart(level: LevelVO): void {
    const { index } = level;
    this.view.updateLevelIndex(index + 1);
    this._checkForButtonsState(index);
  }

  private _onLevelDiamondsUpdate(value: number): void {
    this.view.updateDiamonds(value);
  }

  private _onLevelFlingsUpdate(value: number): void {
    this.view.updateFlings(value);
  }

  private _onLevelStateUpdate(state: LevelState): void {
    switch (state) {
      case LevelState.FAIL:
        this.view.startResetButtonBlinking();
        break;
      default:
        this.view.stopResetButtonBlinking();
    }
  }

  private _checkForButtonsState(levelIndex: number): void {
    const { unlockedLevelIndex } = this.facade.retrieveProxy(PlayerVOProxy).vo;
    this.view.enableButtons();
    if (levelIndex === 0) {
      this.view.disablePrevButton();
    }
    if (levelIndex === unlockedLevelIndex) {
      this.view.disableNextButton();
    }
  }

  private _onPrevLevel(): void {
    this._sendLevelSwitchNotification(-1);
  }

  private _onNextLevel(): void {
    this._sendLevelSwitchNotification(1);
  }

  private _onRetryLevel(): void {
    this._sendLevelSwitchNotification(0);
  }

  private _sendLevelSwitchNotification(increment: number): void {
    this.facade.sendNotification(UIEvents.LevelSwitch, increment);
  }
}
