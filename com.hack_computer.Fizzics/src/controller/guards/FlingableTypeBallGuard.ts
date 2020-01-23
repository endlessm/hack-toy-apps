import { BallType } from "../../constants/types";
import { BallsVOProxy } from "../../models/BallsVOProxy";

export function flingableTypeBallGuard(id: number): boolean {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballVO = ballsVOProxy.getBall(id);
  const ballType = ballVO.species;

  return ballType === BallType.MAIN || ballType === BallType.DIAMOND;
}
