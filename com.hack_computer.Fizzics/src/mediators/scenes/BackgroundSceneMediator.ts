import { Facade } from "@koreez/mvcx";
import { GameEvents, LevelEvents } from "../../constants/EventNames";
import { GameState, SceneKey } from "../../constants/types";
import { BackgroundScene } from "../../scenes/BackgroundScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";

export class BackgroundSceneMediator extends AbstractSceneMediator<BackgroundScene> {
  constructor() {
    super(<BackgroundScene>window.fizzicsGame.scene.getScene(SceneKey.Background));
  }

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._subscribe(GameEvents.StateUpdate, this._onGameStateUpdate);
    this._subscribe(LevelEvents.BgIndexUpdate, this._onLevelBgUpdate);
  }

  public onSceneReady(): void {
    super.onSceneReady();

    this.view.build();
  }

  private _onGameStateUpdate(state: GameState): void {
    switch (state) {
      case GameState.GAME:
        this.view.scene.wake(SceneKey.Background);
        break;
      default:
        this.view.scene.sleep(SceneKey.Background);
    }
  }

  private _onLevelBgUpdate(imageIndex: number): void {
    this.view.updateBackground(imageIndex);
  }
}
