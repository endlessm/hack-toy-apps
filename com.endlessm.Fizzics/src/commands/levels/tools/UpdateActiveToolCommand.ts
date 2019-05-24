import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { ToolType } from "../../../constants/types";
import { PlayableModel } from "../../../models/playable/PlayableModel";
import { FlingToolActiveGuard } from "../../guards/FlingToolActiveGuard";
import { SwitchPhysicsConstraintCommand } from "../../scene/SwitchPhysicsConstraintCommand";
import { DisableBallsFlingCommand } from "../balls/DisableBallsFlingCommand";

export class UpdateActiveToolCommand extends SequenceMacro {
  @inject(String)
  private _toolType: ToolType;

  @inject(PlayableModel)
  private _playableModel: PlayableModel;

  public prepare(): void {
    this.add(SwitchPhysicsConstraintCommand).withPayloads(this._toolType === ToolType.DRAG);
    this.add(DisableBallsFlingCommand).withGuards(FlingToolActiveGuard);
  }

  public execute(): void {
    super.execute();
    this._playableModel.level.toolsModel.updateActiveTool(this._toolType);
  }
}
