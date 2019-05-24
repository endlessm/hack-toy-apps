import { inject } from "@robotlegsjs/core";
import { GAME } from "../../constants/constants";
import { SceneKey } from "../../constants/types";
import { AbstractCommand } from "../AbstractCommand";

export class MinimalAssetsLoadCompleteCommand extends AbstractCommand {
  @inject(GAME)
  private _game: Phaser.Game;

  public execute(): void {
    this._game.scene.start(SceneKey.Preload);
  }
}
