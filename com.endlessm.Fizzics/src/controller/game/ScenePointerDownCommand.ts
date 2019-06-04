import { BallsEvents, GameEvents } from "../../constants/EventNames";
import { isEmpty } from "../../utils/utils";
import { BallView } from "../../views/balls/BallView";
import { flingToolActiveGuard } from "../guards/FlingToolActiveGuard";
import { disableBallsFlingCommand } from "../level/balls/DisableBallsFlingCommand";
import { enableBallsCollisionCommand } from "../level/balls/EnableBallsCollisionCommand";

export function scenePointerDownCommand(e: string, targets: Phaser.GameObjects.GameObject[]): void {
  if (isEmpty(targets)) {
    this.executeCommandWithGuard(flingToolActiveGuard, e, disableBallsFlingCommand);
    this.executeCommand(e, enableBallsCollisionCommand);

    this.sendNotification(GameEvents.FreeSpacePointerDown);
  } else {
    const target = targets[0];
    if (target instanceof BallView) {
      this.sendNotification(BallsEvents.PointerDown, target.id);
    }
  }
}
