import { inject, injectable } from "@robotlegsjs/core";
import { BootScene } from "../../scenes/BootScene";
import { MinimalAssetsLoadCompleteSignal } from "../../signals/MinimalAssetsLoadCompleteSignal";
import { AbstractSceneMediator } from "../AbstractSceneMediator";

@injectable()
export class BootSceneMediator extends AbstractSceneMediator<BootScene> {
  @inject(MinimalAssetsLoadCompleteSignal)
  public minimalAssetsLoadCompleteSignal: MinimalAssetsLoadCompleteSignal;

  protected sceneCreated(): void {
    super.sceneCreated();
    this.minimalAssetsLoadCompleteSignal.dispatch();
  }
}
