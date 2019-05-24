import { inject } from "@robotlegsjs/core";
import { IRawLevel } from "../../constants/types";
import { PlayableModel } from "../../models/playable/PlayableModel";
import { RawLevelsModel } from "../../models/RawLevelsModel";
import { AbstractCommand } from "../AbstractCommand";

export class LevelStartCommand extends AbstractCommand {
  @inject(Number)
  private readonly _levelIndex: number;

  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  @inject(RawLevelsModel)
  private readonly _rawLevelsModel: RawLevelsModel;

  public execute(): void {
    const rawLevel: IRawLevel = this._rawLevelsModel.getLevel(this._levelIndex);
    this._playableModel.initializeLevel(this._levelIndex, rawLevel);
    super.execute();
  }
}
