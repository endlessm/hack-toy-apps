import { updateDiamondsCommand } from "../UpdateDiamondsCommand";
import { removeBallCommand } from "./RemoveBallCommand";

export function diamondCollisionCommand(
  e: string,
  id1: number,
  id2: number
): void {
  this.executeCommand(e, removeBallCommand, id2);
  this.executeCommand(e, updateDiamondsCommand);
}
