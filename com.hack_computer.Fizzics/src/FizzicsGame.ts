import { ToyAppEvents } from "./constants/EventNames";
import { SceneKey } from "./constants/types";
import { FizzicsFacade } from "./FizzicsFacade";
import { IHackToyApps } from "./IHackToyApps";
import { BackgroundScene } from "./scenes/BackgroundScene";
import { GameScene } from "./scenes/GameScene";
import { LevelCompleteScene } from "./scenes/LevelCompleteScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { UIScene } from "./scenes/UIScene";

export class FizzicsGame extends Phaser.Game implements IHackToyApps {
  constructor(gameConfig: GameConfig) {
    super(gameConfig);
    window.flip = this.flip;
    window.reset = this.reset;
    window.saveState = this.saveState;
    window.loadState = this.loadState;

    this.scene.add(SceneKey.Preload, new PreloadScene(SceneKey.Preload));
    this.scene.add(SceneKey.Background, new BackgroundScene(SceneKey.Background));
    this.scene.add(SceneKey.Game, new GameScene(SceneKey.Game));
    this.scene.add(SceneKey.UI, new UIScene(SceneKey.UI));
    this.scene.add(SceneKey.LevelComplete, new LevelCompleteScene(SceneKey.LevelComplete));

    if (window.ToyApp) {
      ToyApp.requestState();
    }

    this._proxyGlobalParameters();
    // this.updateCanvasSize();

    //
    // const { innerWidth, innerHeight } = window;
    // setTimeout(() => {
    // const { canvasBounds, displayScale, displaySize, parentSize } = this.scale;
    // console.warn(parentSize);
    // const diff = window.innerHeight / canvasBounds.height;
    // this.scale.resize(parentSize.width, HEIGHT * diff);
    // TRANSFORM.height = this.scale.height;
    // TRANSFORM.width = this.scale.width;
    // TRANSFORM.center.setTo(this.scale.width / 2, this.scale.height / 2);
    // }, 2000);

    // console.warn(this.scale.resi);

    // setTimeout(() => {
    //   console.log("mta");

    //   this._proxyGlobalParameters();
    // }, 1000);
  }

  // public readonly updateCanvasSize = () => {
  // const w  = window.innerWidth;
  // const h  = window.innerHeight;
  // const scale = Math.min(Math.max(0, ( w/h >= RATIO ) ? h/HEIGHT : w/WIDTH), 1);
  // _worldToWindowScale = scale;
  // canvasID.width = WIDTH * scale;
  // canvasID.height = HEIGHT * scale;
  // debugger
  // };

  // External API

  public readonly flip = () => {
    FizzicsFacade.Instance.sendNotification(ToyAppEvents.GameFlip);
  };

  public readonly reset = () => {
    FizzicsFacade.Instance.sendNotification(ToyAppEvents.GameReset);
  };

  public readonly saveState = (state: Object) => {
    if (window.ToyApp) {
      ToyApp.saveState(state);
    }
    FizzicsFacade.Instance.sendNotification(ToyAppEvents.GameSaveState, state);
  };

  public readonly loadState = (state: Object) => {
    FizzicsFacade.Instance.sendNotification(ToyAppEvents.GameLoadState, state);
  };

  public readonly globalParametersUpdate = (prop: string, val: number | boolean | string) => {
    FizzicsFacade.Instance.sendNotification(ToyAppEvents.GameGlobalParametersUpdate, prop, val);
  };

  private readonly _proxyGlobalParameters = () => {
    const globalParametersUpdate = this.globalParametersUpdate;
    //@ts-ignore
    window.globalParameters._proxy = { ...window.globalParameters };

    Object.keys(window.globalParameters).forEach(prop => {
      if (prop[0] === "_") {
        return;
      }

      Object.defineProperty(window.globalParameters, prop, {
        // tslint:disable-next-line: no-reserved-keywords
        get(): number | boolean | string {
          return window.globalParameters._proxy[prop];
        },
        // tslint:disable-next-line: no-reserved-keywords
        set(val: number | boolean | string): void {
          // if (window.globalParameters._proxy[prop] !== val) {
          window.globalParameters._proxy[prop] = val;
          globalParametersUpdate(prop, val);
          // }
        }
      });
    });
  };
}
