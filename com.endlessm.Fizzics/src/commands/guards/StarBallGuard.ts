import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { STAR_BALL_IDS } from '../../constants/constants';

@injectable()
export class StarBallGuard implements IGuard {
  @inject(Number)
  private _id: number;

  @inject(STAR_BALL_IDS)
  private _ballIDs: number[];

  public approve(): boolean {
    return this._ballIDs.includes(this._id);
  }
}
