import { BallsVOProxy } from "../../../models/BallsVOProxy";

export function disableBallCollisionCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  ballsVOProxy.updateBallCollisionGroup(id, 0);
}
