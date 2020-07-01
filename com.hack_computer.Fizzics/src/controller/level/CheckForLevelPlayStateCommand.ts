import { LevelState } from "../../constants/types";
import { levelFailedGuard } from "../guards/LevelFailedGuard";
import { updateLevelStateCommand } from "./UpdateLevelStateCommand";

export function checkForLevelPlayStateCommand(e: string): void {
  this.executeCommandWithGuard(
    levelFailedGuard,
    e,
    updateLevelStateCommand,
    LevelState.PLAY
  );
}
