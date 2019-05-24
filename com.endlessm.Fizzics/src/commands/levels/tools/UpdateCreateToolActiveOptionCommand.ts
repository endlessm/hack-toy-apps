import { inject } from "@robotlegsjs/core";
import { ACTIVE_LEVEL } from "../../../constants/constants";
import { BallTypes } from "../../../constants/types";
import { LevelModel } from "../../../models/playable/LevelModel";
import { AbstractCommand } from "../../AbstractCommand";

export class UpdateCreateToolActiveOptionCommand extends AbstractCommand {
  @inject(Number)
  private _option: BallTypes;

  @inject(ACTIVE_LEVEL)
  private _activeLevel: LevelModel;

  public execute(): void {
    super.execute();

    const createTool = this._activeLevel.toolsModel.getCreateTool();
    createTool.updateActiveOption(this._option);
  }
}
