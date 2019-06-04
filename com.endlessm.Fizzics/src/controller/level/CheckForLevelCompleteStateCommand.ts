import { noMoreMainBallGuard } from "../guards/NoMoreMainBallGuard";
import { levelCompleteCommand } from "./LevelCompleteCommand";

export function checkForLevelCompleteStateCommand(e: string): void {
  this.executeCommandWithGuard(noMoreMainBallGuard, e, levelCompleteCommand);
}
