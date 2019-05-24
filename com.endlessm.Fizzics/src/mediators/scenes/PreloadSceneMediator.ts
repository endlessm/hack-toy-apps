import { inject, injectable } from "@robotlegsjs/core";
import { PreloadScene } from "../../scenes/PreloadScene";
import { InitialAssetsLoadCompleteSignal } from "../../signals/InitialAssetsLoadCompleteSignal";
import { AbstractSceneMediator } from "../AbstractSceneMediator";

@injectable()
export class PreloadSceneMediator extends AbstractSceneMediator<PreloadScene> {
  @inject(InitialAssetsLoadCompleteSignal)
  private _initialAssetsLoadCompleteSignal: InitialAssetsLoadCompleteSignal;

  protected sceneCreated(): void {
    super.sceneCreated();

    this._initialAssetsLoadCompleteSignal.dispatch();
  }
}
