import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { BOMB_BALL_IDS, DIAMOND_BALL_IDS, ROCK_BALL_IDS, STAR_BALL_IDS } from "../../../constants/constants";
import { IDPair } from "../../../constants/types";
import { CollisionMainBombSignal } from "../../../signals/CollisionMainBombSignal";
import { CollisionMainDiamondSignal } from "../../../signals/CollisionMainDiamondSignal";
import { CollisionMainRockSignal } from "../../../signals/CollisionMainRockSignal";
import { CollisionMainStarSignal } from "../../../signals/CollisionMainStarSignal";
import { CollisionMainWallSignal } from "../../../signals/CollisionMainWallSignal";

export class MainBallCollisionCommand extends SequenceMacro {
  @inject(IDPair)
  private _idPair: IDPair;

  @inject(DIAMOND_BALL_IDS)
  private _diamondBallsIDs: number[];

  @inject(BOMB_BALL_IDS)
  private _bombBallsIDs: number[];

  @inject(STAR_BALL_IDS)
  private _starBallsIDs: number[];

  @inject(ROCK_BALL_IDS)
  private _rockBallsIDs: number[];

  @inject(CollisionMainDiamondSignal)
  private _collisionMainDiamondSignal: CollisionMainDiamondSignal;

  @inject(CollisionMainBombSignal)
  private _collisionMainBombSignal: CollisionMainBombSignal;

  @inject(CollisionMainStarSignal)
  private _collisionMainStarSignal: CollisionMainStarSignal;

  @inject(CollisionMainRockSignal)
  private _collisionMainRockSignal: CollisionMainRockSignal;

  @inject(CollisionMainWallSignal)
  private _collisionMainWallSignal: CollisionMainWallSignal;

  public prepare(): void {
    const ballID = this._idPair.id2;
    if (ballID === undefined) {
      this._collisionMainWallSignal.dispatch(this._idPair);
    } else if (this._diamondBallsIDs.includes(ballID)) {
      this._collisionMainDiamondSignal.dispatch(this._idPair);
    } else if (this._bombBallsIDs.includes(ballID)) {
      this._collisionMainBombSignal.dispatch(this._idPair);
    } else if (this._starBallsIDs.includes(ballID)) {
      this._collisionMainStarSignal.dispatch(this._idPair);
    } else if (this._rockBallsIDs.includes(ballID)) {
      this._collisionMainRockSignal.dispatch(this._idPair);
    }
  }
}
