import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { BallVO } from "../../../models/BallVO";

export function removeBallCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballVO = <BallVO>ballsVOProxy.removeBall(id);
}
