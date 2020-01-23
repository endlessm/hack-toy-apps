import { ToolType } from "../constants/types";

export class ToolVO {
  public t: ToolType;

  public enabled: boolean;

  public inUse: boolean;

  constructor(toolType: ToolType) {
    this.t = toolType;
  }
}
