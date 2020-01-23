import { BallType } from "../constants/types";

export class CreateOptionVO {
  public t: BallType;

  public enabled: boolean;

  constructor(toolType: BallType) {
    this.t = toolType;
  }
}
