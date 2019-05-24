import { inject } from "@robotlegsjs/core";
import { Images } from "../../assets";
import { GAME } from "../../constants/constants";
import { AbstractCommand } from "../AbstractCommand";

export class InitializeNinePatchCommand extends AbstractCommand {
  @inject(GAME)
  private _game: Phaser.Game;

  public execute(): void {
    super.execute();

    this._game.cache.custom.ninePatch.add(Images.LevelBg.Name, {
      top: 2,
      bottom: 16,
      left: 16,
      right: 2
    });
    this._game.cache.custom.ninePatch.add(Images.DiamondBg.Name, {
      top: 1,
      bottom: 1,
      left: 1,
      right: 1
    });
    this._game.cache.custom.ninePatch.add(Images.FlingBg.Name, {
      top: 2,
      bottom: 16,
      left: 2,
      right: 16
    });
    this._game.cache.custom.ninePatch.add(Images.ToolsBg.Name, {
      top: 6,
      bottom: 6,
      left: 6,
      right: 6
    });
    this._game.cache.custom.ninePatch.add(Images.NextLevelBg.Name, {
      top: 22,
      bottom: 22,
      left: 22,
      right: 22
    });
    this._game.cache.custom.ninePatch.add(Images.NextLevelButton.Name, {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    });
  }
}
