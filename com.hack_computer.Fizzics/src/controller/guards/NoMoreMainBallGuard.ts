import { BallType } from "../../constants/types";
import { BallsVOProxy } from "../../models/BallsVOProxy";

export function noMoreMainBallGuard(id: number): boolean {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);

  return ballsVOProxy.vo.getKeysByType(BallType.MAIN).length === 0;
}
