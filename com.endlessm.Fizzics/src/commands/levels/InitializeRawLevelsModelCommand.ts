import { inject } from '@robotlegsjs/core';
import { Jsones } from '../../assets';
import { GAME } from '../../constants/constants';
import { RawLevelsModel } from '../../models/RawLevelsModel';
import { AbstractCommand } from '../AbstractCommand';

export class InitializeRawLevelsModelCommand extends AbstractCommand {
  @inject(GAME)
  private _game: Phaser.Game;

  @inject(RawLevelsModel)
  private _rawLevelsModel: RawLevelsModel;

  public execute(): void {
    const levelsData = this._game.cache.json.get(Jsones.GameLevels.Name);
    this._rawLevelsModel.initialize(Object.freeze(levelsData.levels));
  }
}
