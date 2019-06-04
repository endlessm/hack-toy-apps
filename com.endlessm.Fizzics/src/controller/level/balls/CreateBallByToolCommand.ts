import { MAX_BALLS_COUNT } from "../../../constants/constants";
import { BallsEvents } from "../../../constants/EventNames";
import { BallType, SceneKey } from "../../../constants/types";
import { BallsVOProxy } from "../../../models/BallsVOProxy";
import { ToolsVOProxy } from "../../../models/ToolsVOProxy";
import { isEmpty } from "../../../utils/utils";
import { checkForLevelPlayStateCommand } from "../CheckForLevelPlayStateCommand";
import { createBallCommand } from "./CreateBallCommand";

export function createBallByToolCommand(e: string): void {
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballIDs = ballsVOProxy.vo.keys;
  if (ballIDs.length > MAX_BALLS_COUNT) {
    this.sendNotification(BallsEvents.MaxCountReached);

    return;
  }

  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);
  const activeOption = toolsVOProxy.vo.createTool.activeOption;
  const { downX: ballX, downY: ballY } = window.fizzicsGame.scene.getScene(
    SceneKey.Game
  ).input.activePointer;
  const lastBallID: number = isEmpty(ballIDs) ? 0 : ballIDs[ballIDs.length - 1];
  const newBallID = lastBallID + 1;
  this.executeCommand(
    e,
    createBallCommand,
    ballX,
    ballY,
    activeOption,
    newBallID
  );

  const ballVO = ballsVOProxy.getBall(newBallID);
  this.sendNotification(BallsEvents.CreatedByTool, ballVO);

  if (activeOption === BallType.MAIN) {
    this.executeCommand(e, checkForLevelPlayStateCommand);
  }
}
