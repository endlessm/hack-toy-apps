import { Facade } from "@koreez/mvcx";
import { GameEvents } from "../../constants/EventNames";
import { GameState, SceneKey, } from "../../constants/types";
import { UIScene } from "../../scenes/UIScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";

export class UISceneMediator extends AbstractSceneMediator<UIScene> {
  constructor() {
    super(<UIScene>window.fizzicsGame.scene.getScene(SceneKey.UI));
  }

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._subscribe(GameEvents.StateUpdate, this._onGameStateUpdate);
  }

  public onSceneReady(): void {
    super.onSceneReady();

    this.view.build();
  }

  private _onGameStateUpdate(state: GameState): void {
    switch (state) {
      case GameState.GAME:
        this.view.scene.wake(SceneKey.UI);
        break;
      default:
        this.view.scene.sleep(SceneKey.UI);
    }
  }
}
