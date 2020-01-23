import { LevelState } from "../../constants/types";
import { updateLevelScoreCommand } from "./UpdateLevelScoreCommand";
import { updateLevelStateCommand } from "./UpdateLevelStateCommand";

export function levelCompleteCommand(e: string): void {
  this.executeCommand(e, updateLevelScoreCommand);
  this.executeCommand(e, updateLevelStateCommand, LevelState.COMPLETE);
}
