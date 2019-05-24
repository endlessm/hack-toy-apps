import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { GameState } from "../../constants/types";
import { PlayerModel } from "../../models/PlayerModel";
import { InitializeManagersCommand } from "./InitializeManagersCommand";
import { LevelStartCommand } from "./LevelStartCommand";
import { UpdateGameStateCommand } from "./UpdateGameStateCommand";

export class StartGameCommand extends SequenceMacro {
  @inject(PlayerModel)
  private _playerModel: PlayerModel;

  public prepare(): void {
    this.add(InitializeManagersCommand);
    this.add(UpdateGameStateCommand).withPayloads(GameState.GAME);
    this.add(LevelStartCommand).withPayloads(this._playerModel.unlockedLevelIndex);
  }

  public execute(): void {
    super.execute();
  }
}
