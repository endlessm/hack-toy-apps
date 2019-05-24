import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../constants/constants';
import { LevelModel } from '../../models/playable/LevelModel';
import { RawLevelsModel } from '../../models/RawLevelsModel';

@injectable()
export class IsNotLastLevelGuard implements IGuard {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  @inject(RawLevelsModel)
  private _rawLevelsModel: RawLevelsModel;

  public approve(): boolean {
    return this._activeLevel.index < this._rawLevelsModel.levels.length - 1;
  }
}
