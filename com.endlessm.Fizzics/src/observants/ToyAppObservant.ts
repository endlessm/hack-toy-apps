import { Facade, Observant } from "@koreez/mvcx";
import { SceneEvents } from "../constants/EventNames";

export class ToyAppObservant extends Observant {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._subscribe(SceneEvents.LoadComplete, this._onLoadComplete);
  }

  private _onLoadComplete(): void {
    ToyApp.loadNotify();
  }
}
