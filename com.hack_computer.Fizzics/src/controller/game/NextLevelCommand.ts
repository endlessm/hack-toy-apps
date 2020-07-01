import { switchLevelCommand } from "./SwitchLevelCommand";

export function nextLevelCommand(e: string, increment: number): void {
  this.executeCommand(e, switchLevelCommand, 1);
}
