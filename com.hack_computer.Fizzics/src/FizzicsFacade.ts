import { Facade } from "@koreez/mvcx";
import {
  BallsEvents,
  FacadeEvents,
  FlingerEvents,
  GameEvents,
  SceneEvents,
  ToyAppEvents,
  UIEvents,
  LevelEvents
} from "./constants/EventNames";
import { canvasOutCommand } from "./controller/game/CanvasOutCommand";
import { freeSpacePointerDownCommand } from "./controller/game/FreeSpacePointerDownCommand";
import { globalParametersUpdateCommand } from "./controller/game/GlobalParametersUpdateCommand";
import { nextLevelCommand } from "./controller/game/NextLevelCommand";
import { scenePointerDownCommand } from "./controller/game/ScenePointerDownCommand";
import { scenePointerUpCommand } from "./controller/game/ScenePointerUpCommand";
import { switchLevelCommand } from "./controller/game/SwitchLevelCommand";
import { refreshCursorCommand } from './controller/level/RefreshCursorCommand';
import { ballFlingCommand } from "./controller/level/balls/BallFlingCommand";
import { ballPointerDownCommand } from "./controller/level/balls/BallPointerDownCommand";
import { ballPointerUpCommand } from "./controller/level/balls/BallPointerUpCommand";
import { bombCollisionCommand } from "./controller/level/balls/BombCollisionCommand";
import { diamondCollisionCommand } from "./controller/level/balls/DiamondCollisionCommand";
import { enableBallsCollisionCommand } from "./controller/level/balls/EnableBallsCollisionCommand";
import { rockCollisionCommand } from "./controller/level/balls/RockCollisionCommand";
import { starCollisionCommand } from "./controller/level/balls/StarCollisionCommand";
import { updateActiveToolCommand } from "./controller/level/tools/UpdateActiveToolCommand";
import { updateCreateToolActiveOptionCommand } from "./controller/level/tools/updateCreateToolActiveOptionCommand";
import { initializePlayerModelCommand } from "./controller/player/InitializePlayerModelCommand";
import { loadCompleteCommand } from "./controller/scenes/LoadCompleteCommand";
import { startupCommand } from "./controller/StartupCommand";
import { BackgroundSceneMediator } from "./mediators/scenes/BackgroundSceneMediator";
import { GameSceneMediator } from "./mediators/scenes/GameSceneMediator";
import { LevelCompleteSceneMediator } from "./mediators/scenes/LevelCompleteSceneMediator";
import { PreloadSceneMediator } from "./mediators/scenes/PreloadSceneMediator";
import { UISceneMediator } from "./mediators/scenes/UISceneMediator";
import { CreateToolBarViewMediator } from "./mediators/views/CreateToolBarViewMediator";
import { EffectsViewMediator } from "./mediators/views/EffectsViewMediator";
import { FlingerViewMediator } from "./mediators/views/FlingerViewMediator";
import { LevelBarViewMediator } from "./mediators/views/LevelBarViewMediator";
import { LevelViewMediator } from "./mediators/views/LevelViewMediator";
import { ToolsBarViewMediator } from "./mediators/views/ToolsBarViewMediator";
import { GameVOProxy } from "./models/GameVOProxy";
import { PlayerVOProxy } from "./models/PlayerVOProxy";
import { RawLevelsVOProxy } from "./models/RawLevelsVOProxy";
import { CollisionObservant } from "./observants/CollisionObservant";
import { SoundObservant } from "./observants/SoundObservant";
import { FlingerView } from "./views/balls/FlingerView";
import { LevelView } from "./views/LevelView";
import { CreateToolBarView } from "./views/ui/CreateToolBarView";
import { LevelBarView } from "./views/ui/LevelBarView";
import { ToolsBarView } from "./views/ui/ToolsBarView";
import { CursorObservant } from "./observants/CursorObservant";

export class FizzicsFacade extends Facade {
  public initialize(debug: boolean): void {
    super.initialize(debug);
    this.sendNotification(FacadeEvents.Startup);
  }

  public initializeModel(): void {
    super.initializeModel();

    this.registerProxy(RawLevelsVOProxy);
    this.registerProxy(GameVOProxy);
    this.registerProxy(PlayerVOProxy);
  }

  public initializeController(): void {
    super.initializeController();

    this.registerCommand(FacadeEvents.Startup, startupCommand);

    this.registerCommand(SceneEvents.LoadComplete, loadCompleteCommand);
    this.registerCommand(SceneEvents.DiamondCollision, diamondCollisionCommand);
    this.registerCommand(SceneEvents.StarCollision, starCollisionCommand);
    this.registerCommand(SceneEvents.BombCollision, bombCollisionCommand);
    this.registerCommand(SceneEvents.RockCollision, rockCollisionCommand);

    this.registerCommand(UIEvents.CursorRefresh, refreshCursorCommand);
    this.registerCommand(UIEvents.NextLevel, nextLevelCommand);
    this.registerCommand(UIEvents.LevelSwitch, switchLevelCommand);
    this.registerCommand(UIEvents.ToolSwitch, updateActiveToolCommand);
    this.registerCommand(UIEvents.CreateToolOptionSwitch, updateCreateToolActiveOptionCommand);

    this.registerCommand(ToyAppEvents.GameLoadState, initializePlayerModelCommand);
    this.registerCommand(ToyAppEvents.GameGlobalParametersUpdate, globalParametersUpdateCommand);

    this.registerCommand(GameEvents.PointerDown, scenePointerDownCommand);
    this.registerCommand(GameEvents.FreeSpacePointerDown, freeSpacePointerDownCommand);
    this.registerCommand(GameEvents.PointerUp, scenePointerUpCommand);
    this.registerCommand(GameEvents.CanvasOut, canvasOutCommand);

    this.registerCommand(BallsEvents.PointerDown, ballPointerDownCommand);
    this.registerCommand(BallsEvents.PointerUp, ballPointerUpCommand);

    this.registerCommand(FlingerEvents.FlingEnd, ballFlingCommand);
    this.registerCommand(FlingerEvents.BallDistanceReached, enableBallsCollisionCommand);
  }

  public initializeView(): void {
    super.initializeView();

    this.registerMediator(PreloadSceneMediator);
    this.registerMediator(BackgroundSceneMediator);
    this.registerMediator(GameSceneMediator);
    this.registerMediator(UISceneMediator);
    this.registerMediator(LevelCompleteSceneMediator);
    this.registerMediator(EffectsViewMediator);

    this.registerDynamicMediator(LevelView, LevelViewMediator);
    this.registerDynamicMediator(LevelBarView, LevelBarViewMediator);
    this.registerDynamicMediator(ToolsBarView, ToolsBarViewMediator);
    this.registerDynamicMediator(CreateToolBarView, CreateToolBarViewMediator);
    this.registerDynamicMediator(FlingerView, FlingerViewMediator);
  }

  public initializeObserver(): void {
    super.initializeObserver();

    this.registerObservant(SoundObservant);
    this.registerObservant(CollisionObservant);
    this.registerObservant(CursorObservant);
  }
}
