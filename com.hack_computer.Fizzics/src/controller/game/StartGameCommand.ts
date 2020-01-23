import { GameState } from "../../constants/types";
import { startLastUnlockedLevelCommand } from "./StartLastUnlockedLevelCommand";
import { updateGameStateCommand } from "./UpdateGameStateCommand";

export function startGameCommand(e: string): void {
  this.executeCommand(e, updateGameStateCommand, GameState.GAME);
  this.executeCommand(e, startLastUnlockedLevelCommand);
}
