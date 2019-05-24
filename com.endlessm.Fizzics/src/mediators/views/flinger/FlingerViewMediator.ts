import { inject, injectable } from "@robotlegsjs/core";
import { PlayableModel } from "../../../models/playable/PlayableModel";
import { BallFlingDisabledSignal } from "../../../signals/BallFlingDisabledSignal";
import { BallFlingDistanceChangedSignal } from "../../../signals/BallFlingDistanceChangedSignal";
import { BallFlingDistanceReachedSignal } from "../../../signals/BallFlingDistanceReachedSignal";
import { BallFlingEnabledSignal } from "../../../signals/BallFlingEnabledSignal";
import { BallFlingEndSignal } from "../../../signals/BallFlingEndSignal";
import { BallFlingResetSignal } from "../../../signals/BallFlingResetSignal";
import { BallFlingStartSignal } from "../../../signals/BallFlingStartSignal";
import { FlingerView } from "../../../utils/FlingerView";
import { BallView } from "../../../views/balls/BallView";
import { AbstractViewMediator } from "../../AbstractViewMediator";

@injectable()
export class FlingerViewMediator extends AbstractViewMediator<FlingerView> {
  @inject(BallFlingEnabledSignal)
  private readonly _ballFlingReadySignal: BallFlingEnabledSignal;

  @inject(BallFlingDisabledSignal)
  private readonly _ballFlingDisabledSignal: BallFlingDisabledSignal;

  @inject(BallFlingStartSignal)
  private readonly _ballFlingStartSignal: BallFlingStartSignal;

  @inject(BallFlingEndSignal)
  private readonly _ballFlingEndSignal: BallFlingEndSignal;

  @inject(BallFlingDistanceReachedSignal)
  private readonly _ballFlingDistanceReachedSignal: BallFlingDistanceReachedSignal;

  @inject(BallFlingDistanceChangedSignal)
  private readonly _ballFlingDistanceChangedSignal: BallFlingDistanceChangedSignal;

  @inject(BallFlingResetSignal)
  private readonly _ballFlingResetSignal: BallFlingResetSignal;

  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  public initialize(): void {
    super.initialize();

    this.view.build();
    this.view.on("ballReachedDistance", this._onBallDistanceReached, this);
    this.view.on("flingStart", this._onFlingStart, this);
    this.view.on("flingDistanceChange", this._onFlingDistanceChange, this);
    this.view.on("flingEnd", this._onFlingEnd, this);
    this.view.on("flingReset", this._onFlingReset, this);

    this.addReaction(() => this._playableModel.level, this._cleanup);

    this._ballFlingReadySignal.add(this._startBallFling);
    this._ballFlingDisabledSignal.add(this._stopBallFling);
  }

  private readonly _startBallFling = (ballView: BallView) => {
    this.view.start(ballView);
  };

  private readonly _stopBallFling = (ballView: BallView) => {
    this._cleanup();
  };

  private _onFlingEnd(ballID: number): void {
    this._cleanup();
    this._ballFlingEndSignal.dispatch(ballID);
  }

  private _onFlingReset(ballID: number): void {
    this._ballFlingResetSignal.dispatch();
  }

  private _onBallDistanceReached(ballID: number): void {
    this._ballFlingDistanceReachedSignal.dispatch(ballID);
  }

  private _onFlingDistanceChange(distance: number): void {
    this._ballFlingDistanceChangedSignal.dispatch(distance);
  }

  private _onFlingStart(ballID: number): void {
    this._ballFlingStartSignal.dispatch(ballID);
  }

  private _cleanup(): void {
    this.view.stop();
  }
}
