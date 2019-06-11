import { SceneEvents } from "../../constants/EventNames";
import { SceneKey } from "../../constants/types";
import { PreloadScene } from "../../scenes/PreloadScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";

export class PreloadSceneMediator extends AbstractSceneMediator<PreloadScene> {
  constructor() {
    super(<PreloadScene>window.fizzicsGame.scene.getScene(SceneKey.Preload));
  }

  public setView(view: PreloadScene): void {
    super.setView(view);

    this.view.scene.start(SceneKey.Preload);
  }

  protected onSceneReady(): void {
    super.onSceneReady();

    this.facade.sendNotification(SceneEvents.LoadComplete);
  }
}
