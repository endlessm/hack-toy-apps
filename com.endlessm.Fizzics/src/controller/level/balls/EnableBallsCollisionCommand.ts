import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { BallVO } from "../../../models/BallVO";

export function enableBallsCollisionCommand(e: string): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const balls = ballsVOProxy.vo.values.filter((ball: BallVO) => ball.collisionGroup === 0);

  balls.forEach((ball: BallVO) => {
    ballsVOProxy.updateBallCollisionGroup(ball.id, 1);
  });
}
