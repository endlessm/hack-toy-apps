import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { BallTypesVOProxy } from "../../../models/BallTypesVOProxy";
import { BallVO } from "../../../models/BallVO";

export function disableBallsDragCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballTypesVOProxy = this.retrieveProxy(BallTypesVOProxy);
  const draggableBalls = ballsVOProxy.vo.values.filter((ball: BallVO) => ball.draggable);

  draggableBalls.forEach((ball: BallVO) => {
    const frozenByType = ballTypesVOProxy.getTypeConfig(ball.species).frozen;
    ballsVOProxy.switchBallDrag(ball.id, !frozenByType);
  });
}
