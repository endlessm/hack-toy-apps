import { LevelState } from "../../constants/types";
import { updateLevelStateCommand } from "./UpdateLevelStateCommand";

export function levelFailedCommand(e: string): void {
  this.executeCommand(e, updateLevelStateCommand, LevelState.FAIL);
}
