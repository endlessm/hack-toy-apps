import { inject, injectable } from '@robotlegsjs/core';
import { GameState, SceneKey } from '../../constants/types';
import { GameModel } from '../../models/GameModel';
import { UIScene } from '../../scenes/UIScene';
import { AbstractSceneMediator } from '../AbstractSceneMediator';

@injectable()
export class UISceneMediator extends AbstractSceneMediator<UIScene> {
  @inject(GameModel)
  private _gameModel: GameModel;

  public sceneCreated(): void {
    super.sceneCreated();

    this.scene.build();

    this.addReaction(() => this._gameModel.state, this._checkViewState);
  }

  private _checkViewState(state: GameState): void {
    switch (state) {
      case GameState.GAME:
        this.scene.scene.wake(SceneKey.UI);
        break;
      default:
        this.scene.scene.sleep(SceneKey.UI);
        break;
    }
  }
}
