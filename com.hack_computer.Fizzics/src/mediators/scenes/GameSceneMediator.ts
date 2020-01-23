import { Facade } from "@koreez/mvcx";
import { GameEvents, LevelEvents } from "../../constants/EventNames";
import { GameState, SceneKey } from "../../constants/types";
import { GameScene } from "../../scenes/GameScene";
import { AbstractSceneMediator } from "./AbstractSceneMediator";

export class GameSceneMediator extends AbstractSceneMediator<GameScene> {
  constructor() {
    super(<GameScene>window.fizzicsGame.scene.getScene(SceneKey.Game));
  }

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._subscribe(GameEvents.StateUpdate, this._onGameStateUpdate);
    this._subscribe(LevelEvents.LevelRemoved, this._onLevelRemove);
    this._subscribe(LevelEvents.LevelCreated, this._onLevelCreate);
  }

  public onSceneReady(): void {
    super.onSceneReady();

    this.view.build();

    this.view.input.on("pointerdown", this._onSceneDown, this);
    this.view.input.on("pointerup", this._onSceneUp, this);
  }

  private _onGameStateUpdate(state: GameState): void {
    switch (state) {
      case GameState.GAME:
        this.view.scene.wake(SceneKey.Game);
        break;
      default:
        this.view.scene.sleep(SceneKey.Game);
    }
  }

  private _onLevelRemove(): void {
    this.view.destroyLevel();
  }

  private _onLevelCreate(): void {
    this.view.buildLevel();
  }

  private _onSceneDown(pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]): void {
    if (pointer.leftButtonDown() && !pointer.rightButtonDown()) {
      this.view.input.once("gameout", this._onCanvasOut, this);
      this.facade.sendNotification(GameEvents.PointerDown, targets);
    }
  }

  private _onSceneUp(pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]): void {
    if (!pointer.leftButtonDown()) {
      this.view.input.off("gameout", this._onCanvasOut, this, true);
      this.facade.sendNotification(GameEvents.PointerUp, targets);
    }
  }

  private _onCanvasOut(pointer: Phaser.Input.Pointer): void {
    this.facade.sendNotification(GameEvents.CanvasOut);
  }
}
