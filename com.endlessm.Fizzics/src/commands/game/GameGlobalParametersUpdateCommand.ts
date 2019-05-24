import { inject } from "@robotlegsjs/core";
import { isNullOrUndefined } from "util";
import { BallTypes } from "../../constants/types";
import { PlayableModel } from "../../models/playable/PlayableModel";
import { getEnumValues } from "../../utils/utils";
import { AbstractCommand } from "../AbstractCommand";

export class GameGlobalParametersUpdateCommand extends AbstractCommand {
  @inject(Object)
  private readonly _globalParams: Object;

  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  public execute(): void {
    if (isNullOrUndefined(this._playableModel.level)) {
      return;
    }

    const gp = this._globalParams;
    const ballTypes = getEnumValues(BallTypes);
    const lvl = this._playableModel.level;

    ballTypes.forEach((type: BallTypes) => {
      //@ts-ignore
      lvl.updateTypeProperties(type, "frameIndex", gp[`imageIndex_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "radius", gp[`radius_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "frozen", !gp[`usePhysics_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "gravityScale", gp[`gravity_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "friction", gp[`friction_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "bounce", gp[`collision_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "visualGood", gp[`deathVisualGood_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "visualBad", gp[`deathVisualBad_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "soundGood", gp[`deathSoundGood_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "soundBad", gp[`deathSoundBad_${type}`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "socialForce0", !gp[`socialForce_${type}_0`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "socialForce1", !gp[`socialForce_${type}_1`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "socialForce2", !gp[`socialForce_${type}_2`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "socialForce3", !gp[`socialForce_${type}_3`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "socialForce4", !gp[`socialForce_${type}_4`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "touchDeath", !gp[`touchDeath_${type}_0`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "touchDeath", !gp[`touchDeath_${type}_1`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "touchDeath", !gp[`touchDeath_${type}_2`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "touchDeath", !gp[`touchDeath_${type}_3`]);
      //@ts-ignore
      lvl.updateTypeProperties(type, "touchDeath", !gp[`touchDeath_${type}_4`]);
    });
  }
}
