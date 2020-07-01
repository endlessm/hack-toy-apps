import { initializeRawLevelsModelCommand } from "../game/InitializeRawLevelsModelCommand";
import { startGameCommand } from "../game/StartGameCommand";
import { initializeNinePatchCommand } from "./InitializeNinePatchCommand";
import { initializePhysicsCommand } from "./InitializePhysicsCommand";
import { prepareScenesCommand } from "./PrepareScenesCommand";

export function loadCompleteCommand(e: string): void {
  this.executeCommand(e, initializeRawLevelsModelCommand);
  this.executeCommand(e, initializeNinePatchCommand);
  this.executeCommand(e, prepareScenesCommand);
  this.executeCommand(e, initializePhysicsCommand);
  this.executeCommand(e, startGameCommand);
}
