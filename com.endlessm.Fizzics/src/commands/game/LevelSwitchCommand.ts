import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { PlayableModel } from "../../models/playable/PlayableModel";
import { RawLevelsModel } from "../../models/RawLevelsModel";
import { LevelStartCommand } from "./LevelStartCommand";

export class LevelSwitchCommand extends SequenceMacro {
  @inject(Number)
  private _increment: number;

  @inject(PlayableModel)
  private _playableModel: PlayableModel;

  @inject(RawLevelsModel)
  private _rawLevelsModel: RawLevelsModel;

  public prepare(): void {
    const levelIndex = this._playableModel.level.index;
    const newLevelIndex = Math.min(this._rawLevelsModel.levels.length - 1, levelIndex + this._increment);

    this.add(LevelStartCommand).withPayloads(newLevelIndex);
  }

  public execute(): void {
    super.execute();
  }
}
