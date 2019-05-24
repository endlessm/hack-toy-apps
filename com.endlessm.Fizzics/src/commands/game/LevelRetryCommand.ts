import { inject } from "@robotlegsjs/core";
import { LevelSwitchSignal } from "../../signals/LevelSwitchSignal";
import { AbstractCommand } from "../AbstractCommand";

export class LevelRetryCommand extends AbstractCommand {
  @inject(LevelSwitchSignal)
  private readonly _levelSwitchSignal: LevelSwitchSignal;

  public execute(): void {
    this._levelSwitchSignal.dispatch(0);

    super.execute();
  }
}
