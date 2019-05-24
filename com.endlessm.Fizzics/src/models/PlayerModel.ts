import { injectable } from "@robotlegsjs/core";
import { action, computed, observable } from "mobx";
import { PLAYER_DEFAULTS } from "../constants/constants";
import { IRawPlayer } from "../constants/types";

@injectable()
export class PlayerModel {
  public static readonly STORAGE_KEY: string = "player";

  @observable
  private _unlockedLevelIndex: number = PLAYER_DEFAULTS.unlockedLevel;

  @computed
  public get unlockedLevelIndex(): number {
    return this._unlockedLevelIndex;
  }
  public set unlockedLevelIndex(value: number) {
    this._unlockedLevelIndex = value;
  }

  @action
  public increaseUnlockedLevelIndex(): void {
    this._unlockedLevelIndex++;
  }

  public initialize(rawPlayer: IRawPlayer): void {
    const { unlockedLevel } = rawPlayer;
    this._unlockedLevelIndex = unlockedLevel;
  }

  public getSavableData(): IRawPlayer {
    return {
      unlockedLevel: this._unlockedLevelIndex + 1
    };
  }

  public sync(data: IRawPlayer): void {
    const { unlockedLevel = this._unlockedLevelIndex } = data;
    this._unlockedLevelIndex = unlockedLevel - 1;
  }
}
