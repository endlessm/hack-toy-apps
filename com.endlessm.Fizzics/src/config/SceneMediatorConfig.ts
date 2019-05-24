import { IConfig, inject, injectable } from "@robotlegsjs/core";
import { ISceneMediatorMap, IViewMediatorMap } from "@robotlegsjs/phaser";
import { BackgroundSceneMediator } from "../mediators/scenes/BackgroundSceneMediator";
import { BootSceneMediator } from "../mediators/scenes/BootSceneMediator";
import { GameSceneMediator } from "../mediators/scenes/GameSceneMediator";
import { LevelCompleteSceneMediator } from "../mediators/scenes/LevelCompleteSceneMediator";
import { PreloadSceneMediator } from "../mediators/scenes/PreloadSceneMediator";
import { UISceneMediator } from "../mediators/scenes/UISceneMediator";
import { BallViewMediator } from "../mediators/views/balls/BallViewMediator";
import { FlingerViewMediator } from "../mediators/views/flinger/FlingerViewMediator";
import { CreateToolViewMediator } from "../mediators/views/ui/CreateToolViewMediator";
import { LevelBarMediator } from "../mediators/views/ui/LevelBarMediator";
import { ToolsBarMediator } from "../mediators/views/ui/ToolsBarMediator";
import { BackgroundScene } from "../scenes/BackgroundScene";
import { BootScene } from "../scenes/BootScene";
import { GameScene } from "../scenes/GameScene";
import { LevelCompleteScene } from "../scenes/LevelCompleteScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { UIScene } from "../scenes/UIScene";
import { FlingerView } from "../utils/FlingerView";
import { BallView } from "../views/balls/BallView";
import { CreateToolView } from "../views/ui/CreateToolView";
import { LevelBar } from "../views/ui/LevelBar";
import { ToolsBar } from "../views/ui/ToolsBar";

@injectable()
export class SceneMediatorConfig implements IConfig {
  @inject(IViewMediatorMap)
  private _viewMediatorMap: IViewMediatorMap;

  @inject(ISceneMediatorMap)
  private _sceneMediatorMap: ISceneMediatorMap;

  public configure(): void {
    this._mapSceneMediators();
    this._mapViewMediators();
  }

  private _mapSceneMediators(): void {
    this._sceneMediatorMap.map(BootScene).toMediator(BootSceneMediator);
    this._sceneMediatorMap.map(PreloadScene).toMediator(PreloadSceneMediator);
    this._sceneMediatorMap
      .map(BackgroundScene)
      .toMediator(BackgroundSceneMediator);
    this._sceneMediatorMap.map(GameScene).toMediator(GameSceneMediator);
    this._sceneMediatorMap.map(UIScene).toMediator(UISceneMediator);
    this._sceneMediatorMap
      .map(LevelCompleteScene)
      .toMediator(LevelCompleteSceneMediator);
  }

  private _mapViewMediators(): void {
    this._viewMediatorMap.map(LevelBar).toMediator(LevelBarMediator);
    this._viewMediatorMap.map(ToolsBar).toMediator(ToolsBarMediator);
    this._viewMediatorMap
      .map(CreateToolView)
      .toMediator(CreateToolViewMediator);
    this._viewMediatorMap.map(BallView).toMediator(BallViewMediator);
    this._viewMediatorMap.map(FlingerView).toMediator(FlingerViewMediator);
  }
}
