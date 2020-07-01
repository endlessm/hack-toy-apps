import { BallsEvents } from "../../constants/EventNames";
import { isEmpty } from "../../utils/utils";
import { BallView } from "../../views/balls/BallView";
import { moveToolActiveGuard } from "../guards/MoveToolActiveGuard";
import { disableBallsDragCommand } from "../level/balls/DisableBallsDragCommand";

export function scenePointerUpCommand(e: string, targets: Phaser.GameObjects.GameObject[] = []): void {
  this.executeCommandWithGuard(moveToolActiveGuard, e, disableBallsDragCommand);

  if (isEmpty(targets)) {
    return;
  }

  const target = targets[0];
  if (target instanceof BallView) {
    this.sendNotification(BallsEvents.PointerUp, target.id);
  }
}
