import { Facade, Mediator } from "@koreez/mvcx";
import { AbstractScene } from "../../scenes/AbstractScene";

export class AbstractSceneMediator<T extends AbstractScene> extends Mediator<
  T
> {
  public setView(view: T): void {
    super.setView(view);

    this.view.events.on("init", this.onSceneStart, this);
    this.view.events.on("create", this.onSceneReady, this);
    this.view.events.on("wake", this.onSceneWake, this);
    this.view.events.on("sleep", this.onSceneSleep, this);
    this.view.events.on("destroy", this.onSceneRemove, this);
  }

  protected onSceneStart(): void {
    this.view.logInit();
  }

  protected onSceneReady(): void {
    this.view.logReady();
  }

  protected onSceneWake(): void {
    this.view.logWake();
  }

  protected onSceneSleep(): void {
    this.view.logSleep();
  }

  protected onSceneRemove(): void {
    this.view.logRemove();
  }
}
