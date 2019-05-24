import {
  IConfig,
  IContext,
  inject,
  injectable,
  interfaces
} from "@robotlegsjs/core";
import { ISignalCommandMap } from "@robotlegsjs/signalcommandmap";
import { GameGlobalParametersUpdateCommand } from "../commands/game/GameGlobalParametersUpdateCommand";
import { LevelRetryCommand } from "../commands/game/LevelRetryCommand";
import { LevelSwitchCommand } from "../commands/game/LevelSwitchCommand";
import { BallFlingCommand } from "../commands/levels/balls/BallFlingCommand";
import { BallFlingDistanceReachedCommand } from "../commands/levels/balls/BallFlingDistanceReachedCommand";
import { CollisionWithBombCommand } from "../commands/levels/balls/CollisionWithBombCommand";
import { CollisionWithDiamondCommand } from "../commands/levels/balls/CollisionWithDiamondCommand";
import { CollisionWithStarCommand } from "../commands/levels/balls/CollisionWithStarCommand";
import { CreateBallCommand } from "../commands/levels/balls/CreateBallCommand";
import { MainBallCollisionCommand } from "../commands/levels/balls/MainBallCollisionCommand";
import { GameScenePointerDownCommand } from "../commands/levels/GameScenePointerDownCommand";
import { GameScenePointerUpCommand } from "../commands/levels/GameScenePointerUpCommand";
import { UpdateActiveToolCommand } from "../commands/levels/tools/UpdateActiveToolCommand";
import { UpdateCreateToolActiveOptionCommand } from "../commands/levels/tools/UpdateCreateToolActiveOptionCommand";
import { InitializePlayerModelCommand } from "../commands/player/InitializePlayerModelCommand";
import { InitialAssetsLoadCompleteCommand } from "../commands/scene/InitialAssetsLoadCompleteCommand";
import { MinimalAssetsLoadCompleteCommand } from "../commands/scene/MinimalAssetsLoadCompleteCommand";
import {
  ACTIVE_LEVEL,
  BOMB_BALL_IDS,
  DIAMOND_BALL_IDS,
  MAIN_BALL_IDS,
  ROCK_BALL_IDS,
  STAR_BALL_IDS
} from "../constants/constants";
import { BallTypes } from "../constants/types";
import { AudioManager } from "../managers/AudioManager";
import { EffectsManager } from "../managers/EffectsManager";
import { IntersectionManager } from "../managers/IntersectionManager";
import { GameModel } from "../models/GameModel";
import { LevelModel } from "../models/playable/LevelModel";
import { PlayableModel } from "../models/playable/PlayableModel";
import { PlayerModel } from "../models/PlayerModel";
import { RawLevelsModel } from "../models/RawLevelsModel";
import { BallCreatedSignal } from "../signals/BallCreatedSignal";
import { BallDragEnabledSignal } from "../signals/BallDragEnabledSignal";
import { BallFlingDisabledSignal } from "../signals/BallFlingDisabledSignal";
import { BallFlingDistanceChangedSignal } from "../signals/BallFlingDistanceChangedSignal";
import { BallFlingDistanceReachedSignal } from "../signals/BallFlingDistanceReachedSignal";
import { BallFlingEnabledSignal } from "../signals/BallFlingEnabledSignal";
import { BallFlingEndSignal } from "../signals/BallFlingEndSignal";
import { BallFlingResetSignal } from "../signals/BallFlingResetSignal";
import { BallFlingStartSignal } from "../signals/BallFlingStartSignal";
import { BallMaxCountReachedSignal } from "../signals/BallMaxCountReachedSignal";
import { BallRemovedByToolSignal } from "../signals/BallRemovedByToolSignal";
import { CollisionMainBombSignal } from "../signals/CollisionMainBombSignal";
import { CollisionMainDiamondSignal } from "../signals/CollisionMainDiamondSignal";
import { CollisionMainRockSignal } from "../signals/CollisionMainRockSignal";
import { CollisionMainStarSignal } from "../signals/CollisionMainStarSignal";
import { CollisionMainWallSignal } from "../signals/CollisionMainWallSignal";
import { CreateBallSignal } from "../signals/CreateBallSignal";
import { CreateToolOptionChangeSignal } from "../signals/CreateToolOptionChangeSignal";
import { GameFlipSignal } from "../signals/GameFlipSignal";
import { GameGlobalParametersUpdateSignal } from "../signals/GameGlobalParametersUpdateSignal";
import { GameLoadStateSignal } from "../signals/GameLoadStateSignal";
import { GameResetSignal } from "../signals/GameResetSignal";
import { GameSaveStateSignal } from "../signals/GameSaveStateSignal";
import { GameScenePointerDownSignal } from "../signals/GameScenePointerDownSignal";
import { GameScenePointerUpSignal } from "../signals/GameScenePointerUpSignal";
import { InitialAssetsLoadCompleteSignal } from "../signals/InitialAssetsLoadCompleteSignal";
import { LevelRetrySignal } from "../signals/LevelRetrySignal";
import { LevelSwitchSignal } from "../signals/LevelSwitchSignal";
import { MainBallCollisionSignal } from "../signals/MainBallCollisionSignal";
import { MinimalAssetsLoadCompleteSignal } from "../signals/MinimalAssetsLoadCompleteSignal";
import { ToolSwitchSignal } from "../signals/ToolSwitchSignal";

@injectable()
export class RobotlegsConfig implements IConfig {
  @inject(IContext)
  public context: IContext;

  @inject(ISignalCommandMap)
  public commandMap: ISignalCommandMap;

  public configure(): void {
    this._mapCommands();
    this._mapManagers();
    this._mapModels();
    this._mapSignals();
    this._mapDynamicValues();
  }

  private _mapCommands(): void {
    this.commandMap
      .map(MinimalAssetsLoadCompleteSignal)
      .toCommand(MinimalAssetsLoadCompleteCommand);
    this.commandMap
      .map(InitialAssetsLoadCompleteSignal)
      .toCommand(InitialAssetsLoadCompleteCommand);
    this.commandMap.map(LevelSwitchSignal).toCommand(LevelSwitchCommand);
    this.commandMap.map(LevelRetrySignal).toCommand(LevelRetryCommand);
    this.commandMap
      .map(MainBallCollisionSignal)
      .toCommand(MainBallCollisionCommand);
    this.commandMap
      .map(CollisionMainDiamondSignal)
      .toCommand(CollisionWithDiamondCommand);
    this.commandMap
      .map(CollisionMainStarSignal)
      .toCommand(CollisionWithStarCommand);
    this.commandMap
      .map(CollisionMainBombSignal)
      .toCommand(CollisionWithBombCommand);
    this.commandMap.map(ToolSwitchSignal).toCommand(UpdateActiveToolCommand);
    this.commandMap
      .map(CreateToolOptionChangeSignal)
      .toCommand(UpdateCreateToolActiveOptionCommand);
    this.commandMap
      .map(GameScenePointerDownSignal)
      .toCommand(GameScenePointerDownCommand);
    this.commandMap
      .map(GameScenePointerUpSignal)
      .toCommand(GameScenePointerUpCommand);
    this.commandMap.map(BallFlingEndSignal).toCommand(BallFlingCommand);
    this.commandMap
      .map(BallFlingDistanceReachedSignal)
      .toCommand(BallFlingDistanceReachedCommand);
    this.commandMap.map(CreateBallSignal).toCommand(CreateBallCommand);
    this.commandMap
      .map(GameLoadStateSignal)
      .toCommand(InitializePlayerModelCommand);
    this.commandMap
      .map(GameGlobalParametersUpdateSignal)
      .toCommand(GameGlobalParametersUpdateCommand);
  }

  private _mapManagers(): void {
    this._mapInSingletonScope([
      IntersectionManager,
      EffectsManager,
      AudioManager
    ]);
  }

  private _mapModels(): void {
    this._mapInSingletonScope([
      PlayerModel,
      GameModel,
      RawLevelsModel,
      PlayableModel
    ]);
  }

  private _mapSignals(): void {
    this._mapInSingletonScope([
      BallFlingEnabledSignal,
      BallFlingDisabledSignal,
      BallRemovedByToolSignal,
      CollisionMainWallSignal,
      BallMaxCountReachedSignal,
      BallCreatedSignal,
      CollisionMainRockSignal,
      GameFlipSignal,
      GameResetSignal,
      GameSaveStateSignal,
      BallFlingDistanceChangedSignal,
      BallFlingStartSignal,
      BallFlingResetSignal,
      BallDragEnabledSignal
    ]);
  }

  private _mapDynamicValues(): void {
    this.context.injector
      .bind<LevelModel>(ACTIVE_LEVEL)
      .toDynamicValue(
        (context: interfaces.Context) =>
          context.container.get(PlayableModel).level
      );

    this.context.injector
      .bind<number[]>(MAIN_BALL_IDS)
      .toDynamicValue((context: interfaces.Context) =>
        context.container
          .get(PlayableModel)
          .level.balls.getKeysByType(BallTypes.MAIN)
      );

    this.context.injector
      .bind<number[]>(STAR_BALL_IDS)
      .toDynamicValue((context: interfaces.Context) =>
        context.container
          .get(PlayableModel)
          .level.balls.getKeysByType(BallTypes.STAR)
      );

    this.context.injector
      .bind<number[]>(DIAMOND_BALL_IDS)
      .toDynamicValue((context: interfaces.Context) =>
        context.container
          .get(PlayableModel)
          .level.balls.getKeysByType(BallTypes.DIAMOND)
      );

    this.context.injector
      .bind<number[]>(ROCK_BALL_IDS)
      .toDynamicValue((context: interfaces.Context) =>
        context.container
          .get(PlayableModel)
          .level.balls.getKeysByType(BallTypes.ROCK)
      );

    this.context.injector
      .bind<number[]>(BOMB_BALL_IDS)
      .toDynamicValue((context: interfaces.Context) =>
        context.container
          .get(PlayableModel)
          .level.balls.getKeysByType(BallTypes.BOMB)
      );
  }

  private _mapInSingletonScope(actors: any[]): void {
    actors.forEach((actor: any) => {
      this.context.injector
        .bind(actor)
        .toSelf()
        .inSingletonScope();
    });
  }
}
