import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../constants/constants';
import { LevelModel } from '../../models/playable/LevelModel';
import { BallTypes } from '../../constants/types';

@injectable()
export class NoMainBallExistGuard implements IGuard {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  public approve(): boolean {
    return this._activeLevel.balls.getKeysByType(BallTypes.MAIN).length === 0;
  }
}
