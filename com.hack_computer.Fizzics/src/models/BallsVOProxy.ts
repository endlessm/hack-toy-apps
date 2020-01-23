import { Proxy } from "@koreez/mvcx";
import { BallsEvents } from "../constants/EventNames";
import { BallType, IRawBall } from "../constants/types";
import { BallsMap } from "../utils/BallsMap";
import { BallVO } from "./BallVO";

export class BallsVOProxy extends Proxy<BallsMap<number, BallVO>> {
  public initialize(rawBalls: IRawBall[]): void {
    super.setVO(new BallsMap());

    this._initializeBalls(rawBalls);
  }

  public getBall(ballID: number): BallVO {
    return this.vo.get(ballID);
  }

  public createBall(x: number, y: number, ballType: BallType, id: number): BallVO {
    const rawBall: IRawBall = {
      ID: id,
      x,
      y,
      species: ballType
    };

    const ballVO = this._addBall(rawBall);
    this.facade.sendNotification(BallsEvents.Created, ballVO);
    return ballVO;
  }

  public removeBall(id: number): BallVO {
    const ballVO = this.vo.remove(id);
    this.facade.sendNotification(BallsEvents.Removed, ballVO);

    return ballVO;
  }

  public switchBallDrag(id: number, enable: boolean): void {
    const ballVO = this.vo.get(id);
    ballVO.draggable = enable;
    this.facade.sendNotification(BallsEvents.Draggable, ballVO, enable);
  }

  public switchBallFling(id: number, enable: boolean): void {
    const ballVO = this.vo.get(id);
    if (ballVO.flingable === enable) {
      return;
    }

    ballVO.flingable = enable;

    this.facade.sendNotification(BallsEvents.Flingable, ballVO, enable);
  }

  public updateBallCollisionGroup(id: number, value: number): void {
    const ballVO = this.vo.get(id);
    ballVO.collisionGroup = value;

    this.facade.sendNotification(BallsEvents.CollisionGroup, ballVO, value);
  }

  private _addBall(rawBall: IRawBall): BallVO {
    const id = rawBall.ID;
    const ballVO = new BallVO(rawBall);
    this.vo.set(id, ballVO);

    return ballVO;
  }

  private _initializeBalls(rawBalls: IRawBall[]): void {
    rawBalls.forEach((ball: IRawBall) => {
      this._addBall(ball);
    });
  }
}
