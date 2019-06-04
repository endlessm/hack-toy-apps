import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { BallVO } from "../../../models/BallVO";

export function disableBallsFlingCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const flingableBalls = ballsVOProxy.vo.values.filter((ball: BallVO) => ball.flingable);

  flingableBalls.forEach((ball: BallVO) => {
    ballsVOProxy.switchBallFling(ball.id, false);
  });
}
