import { inject } from "@robotlegsjs/core";
import { ACTIVE_LEVEL } from "../../../constants/constants";
import { LevelModel } from "../../../models/playable/LevelModel";
import { BallDragEnabledSignal } from "../../../signals/BallDragEnabledSignal";
import { AbstractCommand } from "../../AbstractCommand";

export class EnableBallDragCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  @inject(BallDragEnabledSignal)
  private readonly _ballDragEnabledSignal: BallDragEnabledSignal;

  @inject(Number)
  private _id: number;

  public execute(): void {
    super.execute();

    this._activeLevel.switchBallDrag(this._id, true);
    this._ballDragEnabledSignal.dispatch(this._id);
  }
}
