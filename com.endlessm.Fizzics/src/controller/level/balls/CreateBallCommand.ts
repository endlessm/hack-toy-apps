import { BallsVOProxy } from "../../../models/BallsVOProxy";

export function createBallCommand(
  e: string,
  x: number,
  y: number,
  species: number,
  id: number
): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballVO = ballsVOProxy.createBall(x, y, species, id);
}
