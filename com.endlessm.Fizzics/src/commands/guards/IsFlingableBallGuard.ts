import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { DIAMOND_BALL_IDS, MAIN_BALL_IDS } from '../../constants/constants';

@injectable()
export class IsFlingableBallGuard implements IGuard {
  @inject(Number)
  private _id: number;

  @inject(MAIN_BALL_IDS)
  private _mainBallIDs: number[];

  @inject(DIAMOND_BALL_IDS)
  private _diamondBallIDs: number[];

  public approve(): boolean {
    return this._mainBallIDs.includes(this._id) || this._diamondBallIDs.includes(this._id);
  }
}
