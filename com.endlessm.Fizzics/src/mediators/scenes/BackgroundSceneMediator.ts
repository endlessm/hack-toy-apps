import { inject, injectable } from '@robotlegsjs/core';
import { GameState, SceneKey } from '../../constants/types';
import { GameModel } from '../../models/GameModel';
import { LevelModel } from '../../models/playable/LevelModel';
import { PlayableModel } from '../../models/playable/PlayableModel';
import { BackgroundScene } from '../../scenes/BackgroundScene';
import { AbstractSceneMediator } from '../AbstractSceneMediator';

@injectable()
export class BackgroundSceneMediator extends AbstractSceneMediator<BackgroundScene> {
  @inject(GameModel)
  private _gameModel: GameModel;

  @inject(PlayableModel)
  private _playableModel: PlayableModel;

  public initialize(): void {
    super.initialize();
  }

  public sceneCreated(): void {
    super.sceneCreated();

    this.scene.build();

    this.addReaction(() => this._gameModel.state, this._onGameStateChange);
    this.addReaction(() => this._playableModel.level, this._updateBackground);
  }

  private _onGameStateChange(state: GameState): void {
    switch (state) {
      case GameState.GAME:
        this.scene.scene.wake(SceneKey.Background);
        break;
      default:
        this.scene.scene.sleep(SceneKey.Background);
        break;
    }
  }

  private _updateBackground(level: LevelModel): void {
    this.scene.updateBackground(level.backgroundFrame);
  }
}
