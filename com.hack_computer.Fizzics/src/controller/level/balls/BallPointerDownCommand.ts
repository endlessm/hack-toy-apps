import { ToolType } from "../../../constants/types";
import { ToolsVOProxy } from "../../../models/ToolsVOProxy";
import { flingableTypeBallGuard } from "../../guards/FlingableTypeBallGuard";
import { enableBallDragCommand } from "./EnableBallDragCommand";
import { enableBallFlingCommand } from "./EnableBallFlingCommand";
import { removeBallByToolCommand } from "./RemoveBallByToolCommand";

export function ballPointerDownCommand(e: string, id: number): void {
  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);

  switch (toolsVOProxy.vo.activeTool) {
    case ToolType.REMOVE:
      this.executeCommand(e, removeBallByToolCommand, id);
      break;
    case ToolType.MOVE:
      this.executeCommand(e, enableBallDragCommand, id);
      break;
    case ToolType.FLING:
      this.executeCommandWithGuard(
        flingableTypeBallGuard,
        e,
        enableBallFlingCommand,
        id
      );
      break;
    default:
  }
}
