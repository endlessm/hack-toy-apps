import { DynamicMediator, Facade } from "@koreez/mvcx";
import { BallsEvents, BallTypeEvents } from "../../constants/EventNames";
import { BallType } from "../../constants/types";
import { BallsVOProxy } from "../../models/BallsVOProxy";
import { BallTypesVOProxy } from "../../models/BallTypesVOProxy";
import { BallVO } from "../../models/BallVO";
import { LevelView } from "../../views/LevelView";

export class LevelViewMediator extends DynamicMediator<LevelView> {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._subscribe(BallTypeEvents.Radius, this._onTypeRadius);
    this._subscribe(BallTypeEvents.Gravity, this._onTypeGravity);
    this._subscribe(BallTypeEvents.Bounce, this._onTypeBounce);
    this._subscribe(BallTypeEvents.Friction, this._onTypeFriction);
    this._subscribe(BallTypeEvents.Frozen, this._onTypeFrozen);
    this._subscribe(BallTypeEvents.FrameIndex, this._onTypeFrameIndex);

    this._subscribe(BallsEvents.Created, this._onBallCreate);
    this._subscribe(BallsEvents.Removed, this._onBallRemove);
    this._subscribe(BallsEvents.Draggable, this._onBallDraggableUpdate);
    this._subscribe(BallsEvents.Flingable, this._onBallFlingableUpdate);
    this._subscribe(BallsEvents.CollisionGroup, this._onBallCollisionGroupUpdate);

    const ballsVOProxy = this.facade.retrieveProxy(BallsVOProxy);
    this.view.build(ballsVOProxy.vo.values);
  }

  private _onTypeRadius(ballType: BallType, value: number): void {
    this.view.updateTypeRadius(ballType, value);
  }

  private _onTypeGravity(ballType: BallType, value: number): void {
    this.view.updateTypeGravity(ballType, value);
  }

  private _onTypeBounce(ballType: BallType, value: number): void {
    this.view.updateTypeBounce(ballType, value);
  }

  private _onTypeFriction(ballType: BallType, value: number): void {
    this.view.updateTypeFriction(ballType, value);
  }

  private _onTypeFrozen(ballType: BallType, value: boolean): void {
    this.view.updateTypeFrozen(ballType, value);
  }

  private _onBallFrozen(ballVO: BallVO, value: boolean): void {
    this.view.updateBallFrozen(ballVO.id, value);
  }

  private _onTypeFrameIndex(ballType: BallType, value: number): void {
    this.view.updateTypeFrameIndex(ballType, value);
  }

  private _onBallDraggableUpdate(ballVO: BallVO, draggable: boolean): void {
    const ballView = this.view.getBall(ballVO.id);
    ballView.updateFrozen(!draggable);
  }

  private _onBallFlingableUpdate(ballVO: BallVO, flingable: boolean): void {
    if (flingable) {
      this._onBallFrozen(ballVO, true);
      this.view.bringBallToTop(ballVO.id);
    } else {
      const ballTypesVOProxy = this.facade.retrieveProxy(BallTypesVOProxy);
      const typeConfig = ballTypesVOProxy.getTypeConfig(ballVO.species);
      this._onBallFrozen(ballVO, typeConfig.frozen);
    }
  }

  private _onBallCollisionGroupUpdate(ballVO: BallVO, collisionGroup: number): void {
    this.view.updateBallCollisionGroup(ballVO.id, collisionGroup);
  }

  private _onBallCreate(ballModel: BallVO): void {
    const { x, y, species, id } = ballModel;
    const ballTypesVOProxy = this.facade.retrieveProxy(BallTypesVOProxy);
    const typeConfig = ballTypesVOProxy.getTypeConfig(species);
    const { frameIndex, frozen, gravity, bounce, radius, friction } = typeConfig;

    const ballView = this.view.addBall(id, species, x, y);
    ballView.updateTexture(frameIndex);
    ballView.updateFrozen(frozen);
    ballView.updateGravity(gravity);
    ballView.updateBounce(bounce);
    ballView.updateRadius(radius);
    ballView.updateFriction(friction);
  }

  private _onBallRemove(ballModel: BallVO): void {
    const { id } = ballModel;
    const ballView = this.view.removeBall(id);
  }
}
