import { inject } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../../constants/constants';
import { LevelModel } from '../../../models/playable/LevelModel';
import { AbstractCommand } from '../../AbstractCommand';

export class DisableBallDragCommand extends AbstractCommand {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  @inject(Number)
  private _id: number;

  public execute(): void {
    super.execute();

    this._activeLevel.switchBallDrag(this._id, false);
  }
}
