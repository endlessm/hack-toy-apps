import { Context, MVCSBundle } from "@robotlegsjs/core";
import { ContextSceneManager, PhaserBundle } from "@robotlegsjs/phaser";
import { SignalCommandMapExtension } from "@robotlegsjs/signalcommandmap";
import { RobotlegsConfig } from "./config/RobotlegsConfig";
import { SceneMediatorConfig } from "./config/SceneMediatorConfig";
import { GAME } from "./constants/constants";
import { SceneKey } from "./constants/types";
import { IHackToyApps } from "./IHackToyApps";
import { BackgroundScene } from "./scenes/BackgroundScene";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { LevelCompleteScene } from "./scenes/LevelCompleteScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { UIScene } from "./scenes/UIScene";
import { GameFlipSignal } from "./signals/GameFlipSignal";
import { GameGlobalParametersUpdateSignal } from "./signals/GameGlobalParametersUpdateSignal";
import { GameLoadStateSignal } from "./signals/GameLoadStateSignal";
import { GameResetSignal } from "./signals/GameResetSignal";
import { GameSaveStateSignal } from "./signals/GameSaveStateSignal";

export class FizzicsGame extends Phaser.Game implements IHackToyApps {
  //@ts-ignore
  constructor(gameConfig: Phaser.Types.Core.GameConfig) {
    super(gameConfig);
    window.flip = this.flip;
    window.reset = this.reset;
    window.saveState = this.saveState;
    window.loadState = this.loadState;
    this._context = new Context();
    this._context
      .install(MVCSBundle, PhaserBundle, SignalCommandMapExtension)
      .configure(new ContextSceneManager(this.scene))
      .configure(SceneMediatorConfig)
      .configure(RobotlegsConfig)
      .initialize(this._robotlegsInitialized);

    this.scene.add(SceneKey.Boot, new BootScene(SceneKey.Boot));
    this.scene.add(SceneKey.Preload, new PreloadScene(SceneKey.Preload));
    this.scene.add(
      SceneKey.Background,
      new BackgroundScene(SceneKey.Background)
    );
    this.scene.add(SceneKey.Game, new GameScene(SceneKey.Game));
    this.scene.add(SceneKey.UI, new UIScene(SceneKey.UI));
    this.scene.add(
      SceneKey.LEVEL_COMPLETE,
      new LevelCompleteScene(SceneKey.LEVEL_COMPLETE)
    );

    this.scene.start(SceneKey.Boot);
    if (window.ToyApp) {
      ToyApp.requestState();
    }
    this._proxyGlobalParameters();
  }

  private readonly _context: Context;

  // External API

  public readonly flip = () => {
    this._context.injector.get(GameFlipSignal).dispatch();
  };

  public readonly reset = () => {
    this._context.injector.get(GameResetSignal).dispatch();
  };

  public readonly saveState = (state: Object) => {
    if (window.ToyApp) {
      ToyApp.saveState(state);
    }
    this._context.injector.get(GameSaveStateSignal).dispatch(state);
  };

  public readonly loadState = (state: Object) => {
    this._context.injector.get(GameLoadStateSignal).dispatch(state);
  };

  private readonly _robotlegsInitialized = () => {
    this._context.injector.bind(GAME).toConstantValue(this);
  };

  private readonly _globalParametersUpdate = (globalParameters: object) => {
    this._context.injector
      .get(GameGlobalParametersUpdateSignal)
      .dispatch(globalParameters);
  };

  private readonly _proxyGlobalParameters = () => {
    const globalParametersUpdate = this._globalParametersUpdate;
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
          if (window.globalParameters._proxy[prop] !== val) {
            window.globalParameters._proxy[prop] = val;
            globalParametersUpdate(window.globalParameters._proxy);
          }
        }
      });
    });
  };
}
