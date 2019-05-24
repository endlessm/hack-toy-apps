import { inject, injectable } from '@robotlegsjs/core';
import { LevelState, SceneKey } from '../../constants/types';
import { LevelModel } from '../../models/playable/LevelModel';
import { PlayableModel } from '../../models/playable/PlayableModel';
import { RawLevelsModel } from '../../models/RawLevelsModel';
import { LevelCompleteScene } from '../../scenes/LevelCompleteScene';
import { LevelSwitchSignal } from '../../signals/LevelSwitchSignal';
import { AbstractSceneMediator } from '../AbstractSceneMediator';

@injectable()
export class LevelCompleteSceneMediator extends AbstractSceneMediator<LevelCompleteScene> {
  @inject(PlayableModel)
  private _playableModel: PlayableModel;

  @inject(RawLevelsModel)
  private _rawLevelsModel: RawLevelsModel;

  @inject(LevelSwitchSignal)
  private _levelSwitchSignal: LevelSwitchSignal;

  public sceneCreated(): void {
    super.sceneCreated();

    this.scene.build();

    this.addReaction(() => this._playableModel.level, this._onNewLevelReady);

    this.scene.events.on('nextClick', this._onNextClick, this);
  }

  private _onNewLevelReady(level: LevelModel): void {
    this.removeReaction(this._checkForViewState);

    this.addReaction(() => level.state, this._checkForViewState, { fireImmediately: true });
  }

  private _checkForViewState(state: LevelState): void {
    switch (state) {
      case LevelState.COMPLETE:
        this._updateView();
        this.scene.scene.wake(SceneKey.LEVEL_COMPLETE);
        break;
      default:
        this.scene.scene.sleep(SceneKey.LEVEL_COMPLETE);
        break;
    }
  }

  private _updateView(): void {
    const level = this._playableModel.level;
    const { diamonds, flings, score } = level;

    this._updateDiamonds(diamonds);
    this._updateFlings(flings);
    this._updateScore(score);
  }

  private _updateDiamonds(value: number): void {
    this.scene.updateDiamonds(value);
  }

  private _updateFlings(value: number): void {
    this.scene.updateFlings(value);
  }

  private _updateScore(value: number): void {
    this.scene.updateScore(value);
  }

  private _onNextClick(): void {
    this._levelSwitchSignal.dispatch(1);
  }
}
