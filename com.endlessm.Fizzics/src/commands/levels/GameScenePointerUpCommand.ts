import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { MatterImage } from "../../utils/MatterImage";
import { BallPointerUpCommand } from "./balls/BallPointerUpCommand";

export class GameScenePointerUpCommand extends SequenceMacro {
  @inject(Array)
  private _targets: Phaser.GameObjects.GameObject[];

  public prepare(): void {
    // POINTER UP ON FREE AREA
    if (!this._targets.length) {
      return;
    }

    const target = this._targets[0];
    // POINTER UP ON BALL
    if (target instanceof MatterImage) {
      this.add(BallPointerUpCommand).withPayloads(target.getData("id"));
    }
  }
}
