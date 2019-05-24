import { injectable } from '@robotlegsjs/core';
import { action, computed, observable } from 'mobx';
import { GameState } from '../constants/types';

@injectable()
export class GameModel {
  @observable
  private _state: GameState;

  @computed
  public get state(): GameState {
    return this._state;
  }

  public initialize(): void {
    this._state = GameState.UNKNOWN;
  }

  @action
  public updateState(state: GameState): void {
    this._state = state;
  }
}
