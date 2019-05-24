import { inject } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../constants/constants';
import { LevelModel } from '../../models/playable/LevelModel';
import { AbstractCommand } from '../AbstractCommand';

export class UpdateLevelScoreCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  public execute(): void {
    this._activeLevel.updateScore();
  }
}
