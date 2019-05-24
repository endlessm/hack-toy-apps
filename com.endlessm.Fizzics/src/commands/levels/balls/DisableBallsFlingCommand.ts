import { inject } from "@robotlegsjs/core";
import { ACTIVE_LEVEL } from "../../../constants/constants";
import { BallTypes } from "../../../constants/types";
import { BallModel } from "../../../models/balls/BallModel";
import { LevelModel } from "../../../models/playable/LevelModel";
import { AbstractCommand } from "../../AbstractCommand";

export class DisableBallsFlingCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  public execute(): void {
    super.execute();

    const mainBalls = this._activeLevel.balls.getValuesByType(BallTypes.MAIN);
    const diamondBalls = this._activeLevel.balls.getValuesByType(
      BallTypes.DIAMOND
    );

    const flingableBall =
      mainBalls.find((ball: BallModel) => ball.flingable) ||
      diamondBalls.find((ball: BallModel) => ball.flingable);

    if (flingableBall) {
      this._activeLevel.switchBallFling(flingableBall.id, false);
    }
  }
}
