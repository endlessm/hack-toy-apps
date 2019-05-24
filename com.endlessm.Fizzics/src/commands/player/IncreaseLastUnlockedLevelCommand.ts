import { inject } from '@robotlegsjs/core';
import { SequenceMacro } from '@robotlegsjs/macrobot';
import { PlayerModel } from '../../models/PlayerModel';
import { SavePlayerCommand } from './SavePlayerCommand';

export class IncreaseLastUnlockedLevelCommand extends SequenceMacro {
  @inject(PlayerModel)
  private _playerModel: PlayerModel;

  public prepare(): void {
    this.add(SavePlayerCommand);
  }

  public execute(): void {
    this._playerModel.increaseUnlockedLevelIndex();
    super.execute();
  }
}
