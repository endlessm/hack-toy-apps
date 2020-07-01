import { DynamicMediator, Facade } from "@koreez/mvcx";
import { BallsEvents, BallTypeEvents, FlingerEvents, LevelEvents } from "../../constants/EventNames";
import { BallVO } from "../../models/BallVO";
import { BallView } from "../../views/balls/BallView";
import { BallType } from "../../constants/types";
import { FlingerView } from "../../views/balls/FlingerView";
import { LevelViewMediator } from "./LevelViewMediator";

export class FlingerViewMediator extends DynamicMediator<FlingerView> {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this.view.build();

    this.view.on("ballReachedDistance", this._onBallDistanceReached, this);
    this.view.on("flingStart", this._onFlingStart, this);
    this.view.on("flingDistanceChange", this._onFlingDistanceChange, this);
    this.view.on("flingEnd", this._onFlingEnd, this);
    this.view.on("flingReset", this._onFlingReset, this);

    this._subscribe(LevelEvents.LevelStart, this._cleanup);
    this._subscribe(BallsEvents.Flingable, this._onBallFlingEnabled);
    this._subscribe(BallTypeEvents.Frozen, this._onTypeFrozen);
  }

  private _onBallFlingEnabled(ballVO: BallVO, value: boolean): void {
    if (!value) {
      this._cleanup();

      return;
    }

    const levelViewMediator: LevelViewMediator = this.facade.retrieveDynamicMediator("LevelViewMediator");
    const ballView = levelViewMediator.view.getBall(ballVO.id);
    this.view.start(ballView);
  }

  private _onFlingEnd(ballID: number): void {
    this.facade.sendNotification(FlingerEvents.FlingEnd, ballID);
    this._cleanup();
  }

  private _onFlingReset(): void {
    this.facade.sendNotification(FlingerEvents.Reset);
  }

  private _onBallDistanceReached(ballID: number): void {
    this.facade.sendNotification(FlingerEvents.BallDistanceReached, ballID);
  }

  private _onFlingDistanceChange(distance: number): void {
    this.facade.sendNotification(FlingerEvents.Distance, distance);
  }

  private _onFlingStart(ballID: number): void {
    this.facade.sendNotification(FlingerEvents.FlingStart, ballID);
  }

  private _cleanup(): void {
    this.view.stop();
  }

  private _onTypeFrozen(ballType: BallType, value: boolean): void {
    const levelViewMediator: LevelViewMediator = this.facade.retrieveDynamicMediator("LevelViewMediator");
    const balls: BallView[] = levelViewMediator.view.balls.getValuesByType(ballType);
    balls.forEach((ball: BallView) => this._onFlingEnd(ball.id));
  }
}
