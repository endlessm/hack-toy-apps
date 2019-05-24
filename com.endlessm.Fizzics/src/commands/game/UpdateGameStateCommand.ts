import { inject } from '@robotlegsjs/core';
import { GameModel } from '../../models/GameModel';
import { AbstractCommand } from '../AbstractCommand';
import { GameState } from '../../constants/types';

export class UpdateGameStateCommand extends AbstractCommand {
  @inject(GameModel)
  private _gameModel: GameModel;

  @inject(String)
  private _state: GameState;

  public execute(): void {
    this._gameModel.updateState(this._state);
  }
}
