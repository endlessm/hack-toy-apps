import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { MatterImage } from "../../utils/MatterImage";
import { CreateToolActiveGuard } from "../guards/CreateToolActiveGuard";
import { FlingToolActiveGuard } from "../guards/FlingToolActiveGuard";
import { BallPointerDownCommand } from "./balls/BallPointerDownCommand";
import { CreateBallFromToolCommand } from "./balls/CreateBallFromToolCommand";
import { DisableBallsFlingCommand } from "./balls/DisableBallsFlingCommand";

export class GameScenePointerDownCommand extends SequenceMacro {
  @inject(Array)
  private _targets: Phaser.GameObjects.GameObject[];

  public prepare(): void {
    // POINTER DOWN ON FREE AREA
    if (!this._targets.length) {
      this.add(CreateBallFromToolCommand).withGuards(CreateToolActiveGuard);
      this.add(DisableBallsFlingCommand).withGuards(FlingToolActiveGuard);
      return;
    }

    // POINTER DOWN ON BALL
    const target = this._targets[0];
    if (target instanceof MatterImage) {
      this.add(BallPointerDownCommand).withPayloads(target.getData("id"));
    }
  }
}
