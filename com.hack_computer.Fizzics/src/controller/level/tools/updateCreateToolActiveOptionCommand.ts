import { BallType } from "../../../constants/types";
import { CreateToolVOProxy } from "../../../models/CreateToolVOProxy";

export function updateCreateToolActiveOptionCommand(
  e: string,
  option: BallType
): void {
  const createToolVOProxy = this.retrieveProxy(CreateToolVOProxy);
  createToolVOProxy.updateCreateToolActiveOption(option);
}
