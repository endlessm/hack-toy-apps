import { updateFlingsCountCommand } from "../UpdateFlingsCountCommand";
import { disableBallsFlingCommand } from "./DisableBallsFlingCommand";

export function ballFlingCommand(e: string, id: number): void {
  this.executeCommand(e, disableBallsFlingCommand);
  this.executeCommand(e, updateFlingsCountCommand);
}
