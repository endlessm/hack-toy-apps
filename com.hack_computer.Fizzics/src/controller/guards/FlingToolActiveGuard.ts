import { ToolType } from "../../constants/types";
import { ToolsVOProxy } from "../../models/ToolsVOProxy";

export function flingToolActiveGuard(): boolean {
  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);

  return toolsVOProxy.vo.activeTool === ToolType.FLING;
}
