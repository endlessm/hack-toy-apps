import { inject } from "@robotlegsjs/core";
import { ACTIVE_LEVEL, GAME } from "../../../constants/constants";
import { SceneKey } from "../../../constants/types";
import { LevelModel } from "../../../models/playable/LevelModel";
import { BallCreatedSignal } from "../../../signals/BallCreatedSignal";
import { AbstractCommand } from "../../AbstractCommand";

export class CreateBallCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  @inject(BallCreatedSignal)
  private _ballCreatedSignal: BallCreatedSignal;

  @inject(GAME)
  private _game: Phaser.Game;

  public execute(): void {
    const { activeOption: ballType } = this._activeLevel.toolsModel.getCreateTool();
    const { downX: ballX, downY: ballY } = this._game.scene.getScene(SceneKey.Game).input.activePointer;
    const lastBallID = this._activeLevel.balls.keys[this._activeLevel.balls.keys.length - 1] || 0;
    const ballID = lastBallID + 1;
    this._activeLevel.createBall(ballID, ballType, ballX, ballY);
    //
    this._ballCreatedSignal.dispatch(ballID);
    super.execute();
  }
}
