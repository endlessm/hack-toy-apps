import { IGuard, inject, injectable } from '@robotlegsjs/core';
import { ACTIVE_LEVEL } from '../../constants/constants';
import { LevelModel } from '../../models/playable/LevelModel';
import { ToolType } from '../../constants/types';

@injectable()
export class DragToolActiveGuard implements IGuard {
  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  public approve(): boolean {
    return this._activeLevel.toolsModel.activeToolType === ToolType.DRAG;
  }
}
