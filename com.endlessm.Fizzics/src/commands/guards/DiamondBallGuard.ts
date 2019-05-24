import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { DIAMOND_BALL_IDS } from '../../constants/constants';

@injectable()
export class DiamondBallGuard implements IGuard {
  @inject(Number)
  private _id: number;

  @inject(DIAMOND_BALL_IDS)
  private _ballIDs: number[];

  public approve(): boolean {
    return this._ballIDs.includes(this._id);
  }
}
