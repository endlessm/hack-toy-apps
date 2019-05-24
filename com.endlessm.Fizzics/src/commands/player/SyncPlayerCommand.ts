import { inject } from "@robotlegsjs/core";
import { isNullOrUndefined } from "util";
import { IRawPlayer } from "../../constants/types";
import { PlayerModel } from "../../models/PlayerModel";
import { AbstractCommand } from "../AbstractCommand";

export class SyncPlayerCommand extends AbstractCommand {
  @inject(PlayerModel)
  private _playerModel: PlayerModel;

  @inject(Object)
  private _state: Object;

  public execute(): void {
    console.log("SyncPlayerCommand", this._state);
    if (!isNullOrUndefined(this._state)) {
      this._playerModel.sync(<IRawPlayer>this._state);
    }
    super.execute();
  }
}
