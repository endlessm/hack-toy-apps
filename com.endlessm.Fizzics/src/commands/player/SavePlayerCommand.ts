import { inject } from "@robotlegsjs/core";
import { GAME } from "../../constants/constants";
import { IHackToyApps } from "../../IHackToyApps";
import { PlayerModel } from "../../models/PlayerModel";
import { AbstractCommand } from "../AbstractCommand";

export class SavePlayerCommand extends AbstractCommand {
  @inject(PlayerModel)
  private _playerModel: PlayerModel;

  @inject(GAME)
  private _game: IHackToyApps;

  public execute(): void {
    this._game.saveState(this._playerModel.getSavableData());
    super.execute();
  }
}
