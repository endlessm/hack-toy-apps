import { checkForLevelCompleteStateCommand } from "../CheckForLevelCompleteStateCommand";
import { removeBallCommand } from "./RemoveBallCommand";

export function starCollisionCommand(
  e: string,
  id1: number,
  id2: number
): void {
  this.executeCommand(e, removeBallCommand, id1);
  this.executeCommand(e, checkForLevelCompleteStateCommand);
}
