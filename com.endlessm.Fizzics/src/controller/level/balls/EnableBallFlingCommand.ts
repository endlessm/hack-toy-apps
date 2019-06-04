import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { disableBallCollisionCommand } from "./DisableBallCollisionCommand";

export function enableBallFlingCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  ballsVOProxy.switchBallFling(id, true);

  this.executeCommand(e, disableBallCollisionCommand, id, 0);
}
