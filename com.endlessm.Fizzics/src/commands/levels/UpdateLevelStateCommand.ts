import { inject } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../constants/constants';
import { LevelState } from '../../constants/types';
import { LevelModel } from '../../models/playable/LevelModel';
import { AbstractCommand } from '../AbstractCommand';

export class UpdateLevelStateCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  @inject(String)
  private _state: LevelState;

  public execute(): void {
    this._activeLevel.updateState(this._state);
  }
}
