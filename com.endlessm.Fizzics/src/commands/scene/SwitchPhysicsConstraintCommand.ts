import { inject } from "@robotlegsjs/core";
import { GAME } from "../../constants/constants";
import { SceneKey } from "../../constants/types";
import { AbstractCommand } from "../AbstractCommand";

export class SwitchPhysicsConstraintCommand extends AbstractCommand {
  @inject(GAME)
  private _game: Phaser.Game;

  @inject(Boolean)
  private _enable: boolean;

  public execute(): void {
    super.execute();

    const scene = this._game.scene.getScene(SceneKey.Game);

    if (this._enable) {
      scene.matter.add.pointerConstraint({});
    } else {
      // @ts-ignore
      scene.matter.world.localWorld.constraints = [];
    }
  }
}
