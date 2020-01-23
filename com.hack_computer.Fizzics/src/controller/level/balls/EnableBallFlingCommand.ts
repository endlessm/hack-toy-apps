import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { disableBallCollisionCommand } from "./DisableBallCollisionCommand";
import { disableBallsFlingCommand } from "./DisableBallsFlingCommand";

export function enableBallFlingCommand(e: string, id: number): void {
  this.executeCommand(e, disableBallsFlingCommand);

  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  ballsVOProxy.switchBallFling(id, true);

  this.executeCommand(e, disableBallCollisionCommand, id, 0);
}
