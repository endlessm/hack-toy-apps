import { savePlayerCommand } from "./SavePlayerCommand";
import { syncPlayerCommand } from "./SyncPlayerCommand";

export function initializePlayerModelCommand(e: string, state: object): void {
  this.executeCommand(e, syncPlayerCommand, state);
  this.executeCommand(e, savePlayerCommand);
}
