import { inject } from "@robotlegsjs/core";
import { ACTIVE_LEVEL, MAX_BALLS_COUNT } from "../../../constants/constants";
import { LevelModel } from "../../../models/playable/LevelModel";
import { BallMaxCountReachedSignal } from "../../../signals/BallMaxCountReachedSignal";
import { CreateBallSignal } from "../../../signals/CreateBallSignal";
import { AbstractCommand } from "../../AbstractCommand";

export class CreateBallFromToolCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private readonly _activeLevel: LevelModel;

  @inject(BallMaxCountReachedSignal)
  private readonly _ballMaxCountReachedSignal: BallMaxCountReachedSignal;

  @inject(CreateBallSignal)
  private readonly _createBallSignal: CreateBallSignal;

  public execute(): void {
    this._activeLevel.balls.size > MAX_BALLS_COUNT
      ? this._ballMaxCountReachedSignal.dispatch()
      : this._createBallSignal.dispatch();

    super.execute();
  }
}
