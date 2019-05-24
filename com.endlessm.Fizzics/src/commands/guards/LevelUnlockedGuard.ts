import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../constants/constants';
import { LevelModel } from '../../models/playable/LevelModel';
import { PlayerModel } from '../../models/PlayerModel';

@injectable()
export class LevelUnlockedGuard implements IGuard {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  @inject(PlayerModel)
  private _playerModel: PlayerModel;

  public approve(): boolean {
    return this._activeLevel.index >= this._playerModel.unlockedLevelIndex;
  }
}
