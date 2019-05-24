import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { BallRemovedByToolSignal } from "../../../signals/BallRemovedByToolSignal";
import { RemoveBallCommand } from "./RemoveBallCommand";

export class RemoveBallFromToolCommand extends SequenceMacro {
  @inject(Number)
  private readonly _id: number;

  @inject(BallRemovedByToolSignal)
  private readonly _ballRemovedByToolSignal: BallRemovedByToolSignal;

  public prepare(): void {
    this.add(RemoveBallCommand);
  }

  public execute(): void {
    this._ballRemovedByToolSignal.dispatch(this._id);
    super.execute(this._id);
  }
}
