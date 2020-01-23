import { createToolActiveGuard } from "../guards/CreateToolActiveGuard";
import { createBallByToolCommand } from "../level/balls/CreateBallByToolCommand";

export function freeSpacePointerDownCommand(e: string): void {
  this.executeCommandWithGuard(createToolActiveGuard, e, createBallByToolCommand);
}
