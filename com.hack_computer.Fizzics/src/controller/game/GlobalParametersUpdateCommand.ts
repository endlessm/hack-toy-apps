import { ToolType } from "../../constants/types";
import { BallTypesVOProxy } from "../../models/BallTypesVOProxy";
import { CreateToolVOProxy } from "../../models/CreateToolVOProxy";
import { LevelVOProxy } from "../../models/LevelVOProxy";
import { ToolsVOProxy } from "../../models/ToolsVOProxy";

// tslint:disable-next-line: max-func-body-length cyclomatic-complexity
export function globalParametersUpdateCommand(e: string, prop: string, value: number | boolean | string): void {
  console.log(prop, value);

  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);
  const createToolVOProxy = this.retrieveProxy(CreateToolVOProxy);
  const ballTypesVOProxy = this.retrieveProxy(BallTypesVOProxy);

  switch (prop) {
    // __BACKGROUND__
    case "backgroundImageIndex":
      levelVOProxy.updateBackground(value);
      break;
    // __TOOLS__
    case "flingToolDisabled":
      toolsVOProxy.updateToolEnable(ToolType.FLING, !value);
      break;
    case "moveToolDisabled":
      toolsVOProxy.updateToolEnable(ToolType.MOVE, !value);
      break;
    case "createToolDisabled":
      toolsVOProxy.updateToolEnable(ToolType.CREATE, !value);
      break;
    case "deleteToolDisabled":
      toolsVOProxy.updateToolEnable(ToolType.REMOVE, !value);
      break;
    case "flingToolActive":
      toolsVOProxy.updateToolInUse(ToolType.FLING, value);
      break;
    case "moveToolActive":
      toolsVOProxy.updateToolInUse(ToolType.MOVE, value);
      break;
    case "createToolActive":
      toolsVOProxy.updateToolInUse(ToolType.CREATE, value);
      break;
    case "deleteToolActive":
      toolsVOProxy.updateToolInUse(ToolType.REMOVE, value);
      break;

    // __CREATE TOOL OPTIONS__
    case "createType0Disabled":
    case "createType1Disabled":
    case "createType2Disabled":
    case "createType3Disabled":
    case "createType4Disabled":
      createToolVOProxy.updateToolEnable(+prop.charAt(10), !value);
      break;

    // __BALL TYPE PROPERTIES__
    case "radius_0":
    case "radius_1":
    case "radius_2":
    case "radius_3":
    case "radius_4":
      ballTypesVOProxy.updateRadius(+prop.charAt(7), value);
      break;
    case "gravity_0":
    case "gravity_1":
    case "gravity_2":
    case "gravity_3":
    case "gravity_4":
      ballTypesVOProxy.updateGravity(+prop.charAt(8), value);
      break;
    case "collision_0":
    case "collision_1":
    case "collision_2":
    case "collision_3":
    case "collision_4":
      ballTypesVOProxy.updateCollision(+prop.charAt(10), value);
      break;
    case "friction_0":
    case "friction_1":
    case "friction_2":
    case "friction_3":
    case "friction_4":
      ballTypesVOProxy.updateFriction(+prop.charAt(9), value);
      break;
    case "usePhysics_0":
    case "usePhysics_1":
    case "usePhysics_2":
    case "usePhysics_3":
    case "usePhysics_4":
      ballTypesVOProxy.usePhysics(+prop.charAt(11), value);
      break;
    case "deathVisualGood_0":
    case "deathVisualGood_1":
    case "deathVisualGood_2":
    case "deathVisualGood_3":
    case "deathVisualGood_4":
      ballTypesVOProxy.updateDeathVisualGood(+prop.charAt(16), value);
      break;
    case "deathVisualBad_0":
    case "deathVisualBad_1":
    case "deathVisualBad_2":
    case "deathVisualBad_3":
    case "deathVisualBad_4":
      ballTypesVOProxy.updateDeathVisualBad(+prop.charAt(15), value);
      break;
    case "deathSoundGood_0":
    case "deathSoundGood_1":
    case "deathSoundGood_2":
    case "deathSoundGood_3":
    case "deathSoundGood_4":
      ballTypesVOProxy.updateDeathSoundGood(+prop.charAt(15), value);
      break;
    case "deathSoundBad_0":
    case "deathSoundBad_1":
    case "deathSoundBad_2":
    case "deathSoundBad_3":
    case "deathSoundBad_4":
      ballTypesVOProxy.updateDeathSoundBad(+prop.charAt(14), value);
      break;
    case "imageIndex_0":
    case "imageIndex_1":
    case "imageIndex_2":
    case "imageIndex_3":
    case "imageIndex_4":
      ballTypesVOProxy.updateImageIndex(+prop.charAt(11), value);
      break;

    default:
  }
}
