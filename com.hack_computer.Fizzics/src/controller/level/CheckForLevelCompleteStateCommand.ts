import { noMoreMainBallGuard } from "../guards/NoMoreMainBallGuard";
import { levelCompleteCommand } from "./LevelCompleteCommand";
import { LevelVOProxy } from "../../models/LevelVOProxy";
import { LevelState } from "../../constants/types";

export function checkForLevelCompleteStateCommand(e: string): void {
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  if (levelVOProxy.vo.state === LevelState.FAIL)
    return;

  this.executeCommandWithGuard(noMoreMainBallGuard, e, levelCompleteCommand);
}
