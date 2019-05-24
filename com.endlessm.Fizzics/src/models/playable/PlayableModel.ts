import { injectable } from "@robotlegsjs/core";
import { computed, observable } from "mobx";
import { LEVEL_DEFAULTS } from "../../constants/constants";
import { IRawLevel } from "../../constants/types";
import { LevelModel } from "./LevelModel";

@injectable()
export class PlayableModel {
  @observable
  private _level: LevelModel;

  @computed
  public get level(): LevelModel {
    return this._level;
  }

  public initializeLevel(levelIndex: number, rawLevel: IRawLevel): void {
    Object.assign(window.globalParameters, LEVEL_DEFAULTS);
    this._level = new LevelModel(levelIndex, rawLevel);
  }
}
