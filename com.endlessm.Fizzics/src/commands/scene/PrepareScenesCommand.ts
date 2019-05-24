import { inject } from "@robotlegsjs/core";
import { GAME } from "../../constants/constants";
import { SceneKey } from "../../constants/types";
import { AbstractCommand } from "../AbstractCommand";

export class PrepareScenesCommand extends AbstractCommand {
  @inject(GAME)
  private _game: Phaser.Game;

  public execute(): void {
    super.execute();

    this._game.scene.start(SceneKey.Background);
    this._game.scene.start(SceneKey.Game);
    this._game.scene.start(SceneKey.UI);
    this._game.scene.start(SceneKey.LEVEL_COMPLETE);

    this._game.scene.sleep(SceneKey.Background);
    this._game.scene.sleep(SceneKey.Game);
    this._game.scene.sleep(SceneKey.UI);
    this._game.scene.sleep(SceneKey.LEVEL_COMPLETE);

    this._game.scene.stop(SceneKey.Boot);
    this._game.scene.stop(SceneKey.Preload);
  }
}
