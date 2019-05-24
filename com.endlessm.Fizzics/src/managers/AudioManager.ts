import { inject, injectable } from "@robotlegsjs/core";
import { IReactionDisposer, reaction } from "mobx";
import { TRANSFORM } from "..";
import { ToolSound } from "../constants/constants";
import { BallTypes, IDPair, LevelState, ToolType } from "../constants/types";
import { PlayableModel } from "../models/playable/PlayableModel";
import { BallCreatedSignal } from "../signals/BallCreatedSignal";
import { BallDragEnabledSignal } from "../signals/BallDragEnabledSignal";
import { BallFlingDisabledSignal } from "../signals/BallFlingDisabledSignal";
import { BallFlingDistanceChangedSignal } from "../signals/BallFlingDistanceChangedSignal";
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
import { LevelSwitchSignal } from "../signals/LevelSwitchSignal";
import { sample } from "../utils/utils";
import { BallView } from "../views/balls/BallView";

@injectable()
export class AudioManager {
  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  @inject(CollisionMainWallSignal)
  private readonly _collisionMainWallSignal: CollisionMainWallSignal;

  @inject(BallMaxCountReachedSignal)
  private readonly _ballMaxCountReachedSignal: BallMaxCountReachedSignal;

  @inject(BallCreatedSignal)
  private readonly _ballCreatedSignal: BallCreatedSignal;

  @inject(BallRemovedByToolSignal)
  private readonly _ballRemovedByToolSignal: BallRemovedByToolSignal;

  @inject(CollisionMainRockSignal)
  private readonly _collisionMainRockSignal: CollisionMainRockSignal;

  @inject(LevelSwitchSignal)
  private readonly _levelSwitchSignal: LevelSwitchSignal;

  @inject(BallFlingEnabledSignal)
  private readonly _ballFlingEnabledSignal: BallFlingEnabledSignal;

  @inject(BallFlingStartSignal)
  private readonly _ballFlingStartSignal: BallFlingStartSignal;

  @inject(BallFlingDistanceChangedSignal)
  private readonly _ballFlingDistanceChangedSignal: BallFlingDistanceChangedSignal;

  @inject(BallFlingEndSignal)
  private readonly _ballFlingEndSignal: BallFlingEndSignal;

  @inject(BallFlingResetSignal)
  private readonly _ballFlingResetSignal: BallFlingResetSignal;

  @inject(BallDragEnabledSignal)
  private readonly _ballDragEnabledSignal: BallDragEnabledSignal;

  @inject(BallFlingDisabledSignal)
  private readonly _ballFlingDisabledSignal: BallFlingDisabledSignal;

  @inject(CollisionMainDiamondSignal)
  private readonly _collisionMainDiamondSignal: CollisionMainDiamondSignal;

  @inject(CollisionMainBombSignal)
  private readonly _collisionMainBombSignal: CollisionMainBombSignal;

  @inject(CollisionMainStarSignal)
  private readonly _collisionMainStarSignal: CollisionMainStarSignal;

  private _activeToolChangeDisposer: IReactionDisposer;
  private _createToolActiveOptionChangeDisposer: IReactionDisposer;
  private _levelStateChangeDisposer: IReactionDisposer;

  private _playSoundDelegate: (key: string, loop?: boolean) => void;
  private _stopSoundDelegate: (key: string) => void;
  private _updateSoundDelegate: (key: string, rate?: number) => void;

  public initialize(): void {
    if (window.Sounds) {
      this._playSoundDelegate = playSoundToyApp;
      this._stopSoundDelegate = stopSoundToyApp;
      this._updateSoundDelegate = updateSoundToyApp;
    } else {
      this._playSoundDelegate = playSoundDummy;
      this._stopSoundDelegate = stopSoundDummy;
      this._updateSoundDelegate = updateSoundDummy;
    }
    this._playSoundDelegate = window.Sounds ? playSoundToyApp : playSoundDummy;

    reaction(() => this._playableModel.level, this._onNewLevelReady);

    this._ballRemovedByToolSignal.add(this._onBallRemovedFromTool);
    this._collisionMainWallSignal.add(this._onWallCollision);
    this._ballMaxCountReachedSignal.add(this._onTooManyBalls);
    this._ballCreatedSignal.add(this._onBallCreate);
    this._levelSwitchSignal.add(this._onLevelSwitch);
    this._ballFlingEnabledSignal.add(this._onBallFlingEnabled);
    this._ballFlingDisabledSignal.add(this._onBallFlingDisabled);
    this._ballFlingStartSignal.add(this._onBallFlingStart);
    this._ballFlingDistanceChangedSignal.add(this._onFlingDistanceChanged);
    this._ballFlingEndSignal.add(this._onBallFlingEnd);
    this._ballFlingResetSignal.add(this._onBallFlingReset);
    this._ballDragEnabledSignal.add(this._onBallDrag);
    this._collisionMainDiamondSignal.add(this._onMainDiamondCollision);
    this._collisionMainBombSignal.add(this._onMainBombCollision);
    this._collisionMainStarSignal.add(this._onMainStarCollision);
    this._collisionMainRockSignal.add(this._onNeutralCollision);
  }

  private readonly _onBallRemovedFromTool = (ballID: number) => {
    const level = this._playableModel.level;
    this._playSoundDelegate(`fizzics/delete${level.getBallType(ballID)}`);
  };

  private readonly _onWallCollision = () => {
    this._playSoundDelegate("fizzics/collision/wall");
  };

  private readonly _onTooManyBalls = () => {
    this._playSoundDelegate("fizzics/tooManyBalls");
  };

  private readonly _onBallCreate = (ballID: number) => {
    const level = this._playableModel.level;
    this._playSoundDelegate(`fizzics/create${level.getBallType(ballID)}`);
  };

  private readonly _onMainDiamondCollision = (idPair: IDPair) => {
    const level = this._playableModel.level;
    const typeConfig = level.getTypeConfig(level.getBallType(idPair.id2));
    this._playSoundDelegate(`fizzics/death${typeConfig.soundGood}`);
  };

  private readonly _onMainBombCollision = (idPair: IDPair) => {
    const level = this._playableModel.level;
    const typeConfig = level.getTypeConfig(level.getBallType(idPair.id1));
    this._playSoundDelegate(`fizzics/death${typeConfig.soundBad}`);
  };

  private readonly _onMainStarCollision = (idPair: IDPair) => {
    const level = this._playableModel.level;
    const typeConfig = level.getTypeConfig(level.getBallType(idPair.id1));
    this._playSoundDelegate(`fizzics/death${typeConfig.soundGood}`);
  };

  private readonly _onNeutralCollision = (idPair: IDPair) => {
    this._playSoundDelegate("fizzics/collision/neutral");
  };

  private readonly _onActiveToolChange = (type: ToolType) => {
    this._playSoundDelegate(ToolSound[type]);
  };

  private readonly _onCreateToolOptionChange = (option: BallTypes) => {
    const level = this._playableModel.level;
    this._playSoundDelegate(`fizzics/tool${option}`);
  };

  private readonly _onLevelSwitch = (increment: number) => {
    this._playSoundDelegate(
      this._playableModel.level.state === LevelState.COMPLETE && increment === 1
        ? "fizzics/NEXT-LEVEL/clicked"
        : "fizzics/buttonClick"
    );
  };

  private readonly _onBallFlingEnabled = (view: BallView) => {
    this._playSoundDelegate("fizzics/moveFling");
  };

  private readonly _onBallFlingDisabled = (view: BallView) => {
    this._playSoundDelegate("fizzics/unGrab");
  };
  private readonly _onBallFlingStart = (ballID: number) => {
    this._playSoundDelegate("fizzics/pullFling", true);
  };

  private readonly _onBallFlingEnd = (ballID: number) => {
    const level = this._playableModel.level;
    this._playSoundDelegate("fizzics/fling");
    this._playSoundDelegate(`fizzics/fly${level.getBallType(ballID)}`);
  };

  private readonly _onBallFlingReset = () => {
    this._stopSoundDelegate("fizzics/pullFling");
  };

  private readonly _onBallDrag = (ballID: number) => {
    this._playSoundDelegate(
      `fizzics/select${this._playableModel.level.getBallType(ballID) + 1}${sample(["a", "b", "c"])}`
    );
  };

  private readonly _onFlingDistanceChanged = (distance: number) => {
    const { width, height } = TRANSFORM;
    const normalDistance = Math.hypot(width + height) / 2;
    const rate = distance / normalDistance + 0.5;
    this._updateSoundDelegate("fizzics/pullFling", rate);
  };

  private readonly _onLevelStateChange = (state: LevelState) => {
    switch (state) {
      case LevelState.COMPLETE:
        this._playSoundDelegate("fizzics/collision/winning");
        this._playSoundDelegate("fizzics/you_won", true);
        break;
      case LevelState.PLAY:
        this._playSoundDelegate(`fizzics/level/${(this._playableModel.level.index % 10) + 1}/background`, true);
        break;
      default:
    }
  };

  private readonly _onNewLevelReady = () => {
    if (this._activeToolChangeDisposer !== undefined) {
      this._activeToolChangeDisposer();
    }
    if (this._createToolActiveOptionChangeDisposer !== undefined) {
      this._createToolActiveOptionChangeDisposer();
    }
    if (this._levelStateChangeDisposer !== undefined) {
      this._levelStateChangeDisposer();
    }

    const level = this._playableModel.level;

    this._activeToolChangeDisposer = reaction(() => level.toolsModel.activeToolType, this._onActiveToolChange);
    const createToolVO = level.toolsModel.getCreateTool();
    this._createToolActiveOptionChangeDisposer = reaction(
      () => createToolVO.activeOption,
      this._onCreateToolOptionChange
    );
    this._levelStateChangeDisposer = reaction(() => level.state, this._onLevelStateChange, { fireImmediately: true });
  };
}

function playSoundDummy(key: string, loop: boolean = false): void {
  console.warn(`play sound key: ${key} loop: ${loop}`);
}

function playSoundToyApp(key: string, loop: boolean = false): void {
  loop ? window.Sounds.playLoop(key) : window.Sounds.play(key);
}

function stopSoundDummy(key: string): void {
  console.warn(`stop sound key: ${key}`);
}

function stopSoundToyApp(key: string): void {
  window.Sounds.stop(key);
}

function updateSoundDummy(key: string, rate: number): void {
  console.warn(`update sound key: ${key}, rate: ${rate}`);
}

function updateSoundToyApp(key: string, rate: number): void {
  window.Sounds.updateSound(key, 100, {
    rate
  });
}
