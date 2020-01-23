import { ToolType } from "../constants/types";
import { CreateToolVO } from "./CreateToolVO";
import { ToolVO } from "./ToolVO";

export class ToolsVO {
  public tools: Map<ToolType, ToolVO>;

  public activeTool: ToolType;

  constructor() {
    const flingTool = new ToolVO(ToolType.FLING);
    const moveTool = new ToolVO(ToolType.MOVE);
    const createTool = new CreateToolVO();
    const removeTool = new ToolVO(ToolType.REMOVE);

    this.tools = new Map([
      [flingTool.t, flingTool],
      [moveTool.t, moveTool],
      [createTool.t, createTool],
      [removeTool.t, removeTool]
    ]);
  }

  public get createTool(): CreateToolVO {
    return <CreateToolVO>this.tools.get(ToolType.CREATE);
  }
}
