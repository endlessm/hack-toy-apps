import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { DeleteToolActiveGuard } from "../../guards/DeleteToolActiveGuard";
import { DragToolActiveGuard } from "../../guards/DragToolActiveGuard";
import { FlingToolActiveGuard } from "../../guards/FlingToolActiveGuard";
import { IsFlingableBallGuard } from "../../guards/IsFlingableBallGuard";
import { DisableBallsFlingCommand } from "./DisableBallsFlingCommand";
import { EnableBallDragCommand } from "./EnableBallDragCommand";
import { EnableBallFlingCommand } from "./EnableBallFlingCommand";
import { RemoveBallFromToolCommand } from "./RemoveBallFromToolCommand";

export class BallPointerDownCommand extends SequenceMacro {
  @inject(Number)
  private _id: number;

  public prepare(): void {
    this.add(DisableBallsFlingCommand).withGuards(FlingToolActiveGuard);
    this.add(RemoveBallFromToolCommand).withGuards(DeleteToolActiveGuard);
    this.add(EnableBallDragCommand).withGuards(DragToolActiveGuard);
    this.add(EnableBallFlingCommand).withGuards(IsFlingableBallGuard, FlingToolActiveGuard);
  }
}
