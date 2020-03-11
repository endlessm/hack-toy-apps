import { Facade, Mediator } from "@koreez/mvcx";
import {
  BallsEvents,
  LevelEvents,
  SceneEvents
} from "../../constants/EventNames";
import { BallType } from "../../constants/types";
import { BallTypesVOProxy } from "../../models/BallTypesVOProxy";
import { BallTypeVO } from "../../models/BallTypeVO";
import { BallVO } from "../../models/BallVO";
import { LevelVO } from "../../models/LevelVO";
import { LevelView } from "../../views/LevelView";
import { EffectsView } from "../../views/visuals/EffectsView";

export class EffectsViewMediator extends Mediator<EffectsView> {
  private _levelView: LevelView;
  private _typesProxy: BallTypesVOProxy;

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    super.setView(new EffectsView());

    this._subscribe(LevelEvents.LevelStart, this._onLevelStart);
    this._subscribe(BallsEvents.RemovedByTool, this._onBallRemovedByTool);
    this._subscribe(SceneEvents.BombCollision, this._onBombCollision);
    this._subscribe(SceneEvents.StarCollision, this._onStarCollision);
    this._subscribe(SceneEvents.DiamondCollision, this._onDiamondCollision);
  }

  private _onLevelStart(levelVO: LevelVO): void {
    this.view.cleanup();
    this._levelView = <LevelView>(
      this.facade.retrieveDynamicMediator("LevelViewMediator").view
    );
    this._typesProxy = this.facade.retrieveProxy(BallTypesVOProxy);
  }

  private _onBallRemovedByTool(ballVO: BallVO): void {
    this.view.show(this._getBallPosition(ballVO.id), "delete_ball");
  }

  private _onBombCollision(id1: number, id2: number): void {
    this.view.show(
      this._getBallPosition(id1),
      `collision_${this._getTypeConfig(BallType.MAIN).visualBad + 1}`
    );
  }

  private _onStarCollision(id1: number, id2: number): void {
    this.view.show(
      this._getBallPosition(id1),
      `collision_${this._getTypeConfig(BallType.STAR).visualGood + 1}`,
      0.7
    );
  }

  private _onDiamondCollision(id1: number, id2: number): void {
    this.view.show(
      this._getBallPosition(id2),
      `collision_${this._getTypeConfig(BallType.DIAMOND).visualGood + 1}`
    );
  }

  private _getTypeConfig(ballType: BallType): BallTypeVO {
    return this._typesProxy.getTypeConfig(ballType);
  }

  private _getBallPosition(id: number): Phaser.Geom.Point {
    // @ts-ignore
    return this._levelView.getBall(id).getData("positionBeforeDestroy");
  }
}
