import { BallsEvents } from "../../../constants/EventNames";
import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { checkForLevelFailStateCommand } from "../CheckForLevelFailStateCommand";
import { removeBallCommand } from "./RemoveBallCommand";

export function removeBallByToolCommand(e: string, id: number): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballVO = ballsVOProxy.getBall(id);

  this.executeCommand(e, removeBallCommand, id);

  this.sendNotification(BallsEvents.RemovedByTool, ballVO);

  this.executeCommand(e, checkForLevelFailStateCommand, id);
}
