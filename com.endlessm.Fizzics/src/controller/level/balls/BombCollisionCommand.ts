import { checkForLevelFailStateCommand } from "../CheckForLevelFailStateCommand";
import { removeBallCommand } from "./RemoveBallCommand";

export function bombCollisionCommand(e: string, id1: number, id2: number): void {
  this.executeCommand(e, removeBallCommand, id1);
  this.executeCommand(e, checkForLevelFailStateCommand);
}
