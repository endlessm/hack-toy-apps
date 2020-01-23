import { noMoreMainBallGuard } from "../guards/NoMoreMainBallGuard";
import { levelFailedCommand } from "./LevelFailedCommand";

export function checkForLevelFailStateCommand(e: string): void {
  this.executeCommandWithGuard(noMoreMainBallGuard, e, levelFailedCommand);
}
