import { UIEvents, LevelEvents, BallTypeEvents } from "../../constants/EventNames";
import { LevelState, SceneKey, BallType } from "../../constants/types";
import { LevelCompleteScene } from "../../scenes/LevelCompleteScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";

export class LevelCompleteSceneMediator extends AbstractSceneMediator<
  LevelCompleteScene
> {
  constructor() {
    super(<LevelCompleteScene>(
      window.fizzicsGame.scene.getScene(SceneKey.LevelComplete)
    ));
  }

  public onSceneReady(): void {
    super.onSceneReady();

    this.view.build();

    this._subscribe(LevelEvents.StateUpdate, this._onLevelStateUpdate);
    this._subscribe(BallTypeEvents.FrameIndex, this._onBallTypeImageUpdate);
    this._subscribe(LevelEvents.DiamondsUpdate, this._onDiamondsUpdate);
    this._subscribe(LevelEvents.FlingsUpdate, this._onFlingsUpdate);
    this._subscribe(LevelEvents.ScoreUpdate, this._onScoreUpdate);

    this.view.events.on("nextClick", this._onNexClick, this);
  }

  private _onLevelStateUpdate(state: LevelState): void {
    switch (state) {
      case LevelState.COMPLETE:
        this.view.scene.wake(SceneKey.LevelComplete);
        break;
      default:
        this.view.scene.sleep(SceneKey.LevelComplete);
    }
  }

  private _onBallTypeImageUpdate(ballType: BallType, value: number): void {
    if (ballType === BallType.MAIN) {
      this.view.updateBallImage(value)
    }
  }

  private _onDiamondsUpdate(value: number): void {
    this.view.updateDiamonds(value);
  }

  private _onFlingsUpdate(value: number): void {
    this.view.updateFlings(value);
  }

  private _onScoreUpdate(value: number): void {
    this.view.updateScore(value);
  }

  private _onNexClick(): void {
    this.facade.sendNotification(UIEvents.NextLevel);
  }
}
