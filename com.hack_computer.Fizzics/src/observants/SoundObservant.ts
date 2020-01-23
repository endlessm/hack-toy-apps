import { Facade, Observant } from "@koreez/mvcx";
import { TRANSFORM } from "..";
import { ToolSound } from "../constants/constants";
import { BallsEvents, FlingerEvents, LevelEvents, SceneEvents, ToolsEvents, UIEvents } from "../constants/EventNames";
import { BallType, LevelState, ToolType } from "../constants/types";
import { BallsVOProxy } from "../models/BallsVOProxy";
import { BallTypesVOProxy } from "../models/BallTypesVOProxy";
import { BallTypeVO } from "../models/BallTypeVO";
import { BallVO } from "../models/BallVO";
import { LevelVO } from "../models/LevelVO";
import { LevelVOProxy } from "../models/LevelVOProxy";
import { sample } from "../utils/utils";
import { AbstractSound, ToyAppSound, WebAppSound } from "../views/sound/Sound";

export class SoundObservant extends Observant {
  private _sound: AbstractSound;
  private _typesProxy: BallTypesVOProxy;
  private _levelProxy: LevelVOProxy;
  private _ballsProxy: BallsVOProxy;

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._sound = !!window.ToyApp ? new ToyAppSound() : new WebAppSound();

    this._subscribe(UIEvents.LevelSwitch, this._onLevelSwitch);
    this._subscribe(UIEvents.NextLevel, this._onNextLevel);

    this._subscribe(LevelEvents.LevelStart, this._onLevelStart);
    this._subscribe(LevelEvents.StateUpdate, this._onLevelStateChange);

    this._subscribe(SceneEvents.WallCollision, this._onWallCollision);
    this._subscribe(SceneEvents.BombCollision, this._onBombCollision);
    this._subscribe(SceneEvents.StarCollision, this._onStarCollision);
    this._subscribe(SceneEvents.DiamondCollision, this._onDiamondCollision);
    this._subscribe(SceneEvents.RockCollision, this._onRockCollision);

    this._subscribe(BallsEvents.RemovedByTool, this._onBallRemoveByTool);
    this._subscribe(BallsEvents.CreatedByTool, this._onBallCreatedByTool);
    this._subscribe(BallsEvents.MaxCountReached, this._onBallsMaxCountReached);
    this._subscribe(BallsEvents.DragEnabled, this._onBallDragEnable);
    this._subscribe(BallsEvents.Flingable, this._onBallFlingUpdate);

    this._subscribe(ToolsEvents.ActiveToolUpdate, this._onActiveToolUpdate);
    this._subscribe(ToolsEvents.CreateToolActiveOptionUpdate, this._onCreateToolActiveOptionChange);

    this._subscribe(FlingerEvents.Distance, this._onFlingerDistanceUpdate);
    this._subscribe(FlingerEvents.FlingStart, this._onFlingerStart);
    this._subscribe(FlingerEvents.FlingEnd, this._onFlingerEnd);
    this._subscribe(FlingerEvents.Reset, this._onFlingerReset);
  }

  private _onFlingerStart(ballID: number): void {
    this._sound.play("fizzics/pullFling", true);
  }

  private _onFlingerEnd(ballID: number): void {
    const ballType = this._ballsProxy.getBall(ballID).species;
    this._sound.play("fizzics/fling");
    this._sound.play(`fizzics/fly${ballType}`);
  }

  private _onFlingerReset(): void {
    this._sound.stop("fizzics/pullFling");
  }

  private _onFlingerDistanceUpdate(distance: number): void {
    const { width, height } = TRANSFORM;
    const normalDistance = Math.hypot(width + height) / 2;
    const rate = distance / normalDistance + 0.5;
    this._sound.update("fizzics/pullFling", rate);
  }

  private _onLevelStart(levelVO: LevelVO): void {
    this._levelProxy = this.facade.retrieveProxy(LevelVOProxy);
    this._typesProxy = this.facade.retrieveProxy(BallTypesVOProxy);
    this._ballsProxy = this.facade.retrieveProxy(BallsVOProxy);

    this._onLevelStateChange(this._levelProxy.vo.state);
  }

  private _onLevelStateChange(state: LevelState): void {
    switch (state) {
      case LevelState.COMPLETE:
        this._sound.play("fizzics/collision/winning");
        this._sound.play("fizzics/you_won", true);
        break;
      case LevelState.PLAY:
        const soundKey = `fizzics/level/${(this._levelProxy.vo.index % 10) + 1}/background`;
        this._sound.play(soundKey, true);
        break;
      default:
    }
  }

  private _onLevelSwitch(increment: number): void {
    this._sound.play("fizzics/buttonClick");
  }

  private _onNextLevel(): void {
    this._sound.play("fizzics/NEXT-LEVEL/clicked");
  }

  private _onBallRemoveByTool(ballVO: BallVO): void {
    this._sound.play(`fizzics/delete${ballVO.species}`);
  }

  private _onBallsMaxCountReached(): void {
    this._sound.play(`fizzics/tooManyBalls`);
  }

  private _onBallDragEnable(id: number, enable: boolean): void {
    const ballVO = this._ballsProxy.getBall(id);
    this._sound.play(`fizzics/select${ballVO.species + 1}${sample(["a", "b", "c"])}`);
  }

  private _onBallFlingUpdate(ballVO: BallVO, enable: boolean): void {
    if (enable) {
      this._sound.play("fizzics/moveFling");
    } else {
      this._sound.play("fizzics/unGrab");
    }
  }

  private _onActiveToolUpdate(toolType: ToolType): void {
    //@ts-ignore
    this._sound.play(ToolSound[toolType]);
  }

  private _onCreateToolActiveOptionChange(option: BallType): void {
    this._sound.play(`fizzics/tool${option}`);
  }

  private _onBallCreatedByTool(ballVO: BallVO): void {
    this._sound.play(`fizzics/create${ballVO.species}`);
  }

  private _onWallCollision(ballID: number): void {
    this._sound.play(`fizzics/collision/wall`);
  }

  private _onBombCollision(id1: number, id2: number): void {
    this._sound.play(`fizzics/death${this._getTypeConfig(BallType.MAIN).soundBad}`);
  }

  private _onStarCollision(id1: number, id2: number): void {
    this._sound.play(`fizzics/death${this._getTypeConfig(BallType.MAIN).soundGood}`);
  }

  private _onDiamondCollision(id1: number, id2: number): void {
    this._sound.play(`fizzics/death${this._getTypeConfig(BallType.DIAMOND).soundGood}`);
  }

  private _onRockCollision(id1: number, id2: number): void {
    this._sound.play("fizzics/collision/neutral");
  }

  private _getTypeConfig(ballType: BallType): BallTypeVO {
    return this._typesProxy.getTypeConfig(ballType);
  }
}
