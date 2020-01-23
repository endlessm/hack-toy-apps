import { BallsEvents } from "../../../constants/EventNames";
import { BallsVOProxy } from "../../../models/BallsVOProxy";

export function enableBallDragCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  ballsVOProxy.switchBallDrag(id, true);

  this.sendNotification(BallsEvents.DragEnabled, id);
}
