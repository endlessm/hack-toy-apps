import { injectable } from '@robotlegsjs/core';
import { IRawLevel } from '../constants/types';

@injectable()
export class RawLevelsModel {
  private _levels: IRawLevel[];

  public get levels(): IRawLevel[] {
    return this._levels;
  }

  public initialize(levels: IRawLevel[]): void {
    this._levels = levels;
  }

  public getLevel(levelIndex: number): IRawLevel {
    return this._levels[levelIndex];
  }
}
