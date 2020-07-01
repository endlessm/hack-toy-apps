import { ToolType } from "../../../constants/types";
import { ToolsVOProxy } from "../../../models/ToolsVOProxy";
import { flingToolActiveGuard } from "../../guards/FlingToolActiveGuard";
import { disablePhysicsConstraintCommand } from "../../scenes/DisablePhysicsConstraintCommand";
import { enablePhysicsConstraintCommand } from "../../scenes/EnablePhysicsConstraintCommand";
import { disableBallsFlingCommand } from "../balls/DisableBallsFlingCommand";

export function updateActiveToolCommand(e: string, toolType: ToolType): void {
  this.executeCommandWithGuard(flingToolActiveGuard, e, disableBallsFlingCommand);

  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);
  toolsVOProxy.updateActiveTool(toolType);

  toolType === ToolType.MOVE
    ? this.executeCommand(e, enablePhysicsConstraintCommand)
    : this.executeCommand(e, disablePhysicsConstraintCommand);
}
