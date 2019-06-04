import { ToolType } from "../../constants/types";
import { BallTypesVOProxy } from "../../models/BallTypesVOProxy";
import { CreateToolVOProxy } from "../../models/CreateToolVOProxy";
import { LevelVOProxy } from "../../models/LevelVOProxy";
import { ToolsVOProxy } from "../../models/ToolsVOProxy";

export function globalParametersSetupCommand(e: string): void {
  const gp = window.globalParameters;
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);
  const createToolVOProxy = this.retrieveProxy(CreateToolVOProxy);
  const ballTypesVOProxy = this.retrieveProxy(BallTypesVOProxy);

  levelVOProxy.updateBackground(gp.backgroundImageIndex);
  toolsVOProxy.updateToolEnable(ToolType.FLING, !gp.flingToolDisabled);
  toolsVOProxy.updateToolEnable(ToolType.MOVE, !gp.moveToolDisabled);

  toolsVOProxy.updateToolEnable(ToolType.CREATE, !gp.createToolDisabled);
  toolsVOProxy.updateToolEnable(ToolType.REMOVE, !gp.deleteToolDisabled);
  toolsVOProxy.updateToolInUse(ToolType.FLING, gp.flingToolActive);
  toolsVOProxy.updateToolInUse(ToolType.MOVE, gp.moveToolActive);
  toolsVOProxy.updateToolInUse(ToolType.CREATE, gp.createToolActive);
  toolsVOProxy.updateToolInUse(ToolType.REMOVE, gp.deleteToolActive);

  createToolVOProxy.updateToolEnable(0, !gp.createType0Disabled);
  createToolVOProxy.updateToolEnable(1, !gp.createType1Disabled);
  createToolVOProxy.updateToolEnable(2, !gp.createType2Disabled);
  createToolVOProxy.updateToolEnable(3, !gp.createType3Disabled);
  createToolVOProxy.updateToolEnable(4, !gp.createType4Disabled);

  ballTypesVOProxy.updateRadius(0, gp.radius_0);
  ballTypesVOProxy.updateRadius(1, gp.radius_1);
  ballTypesVOProxy.updateRadius(2, gp.radius_2);
  ballTypesVOProxy.updateRadius(3, gp.radius_3);
  ballTypesVOProxy.updateRadius(4, gp.radius_4);

  ballTypesVOProxy.updateGravity(0, gp.gravity_0);
  ballTypesVOProxy.updateGravity(1, gp.gravity_1);
  ballTypesVOProxy.updateGravity(2, gp.gravity_2);
  ballTypesVOProxy.updateGravity(3, gp.gravity_3);
  ballTypesVOProxy.updateGravity(4, gp.gravity_4);

  ballTypesVOProxy.updateCollision(0, gp.collision_0);
  ballTypesVOProxy.updateCollision(1, gp.collision_1);
  ballTypesVOProxy.updateCollision(2, gp.collision_2);
  ballTypesVOProxy.updateCollision(3, gp.collision_3);
  ballTypesVOProxy.updateCollision(4, gp.collision_4);

  ballTypesVOProxy.updateFriction(0, gp.friction_0);
  ballTypesVOProxy.updateFriction(1, gp.friction_1);
  ballTypesVOProxy.updateFriction(2, gp.friction_2);
  ballTypesVOProxy.updateFriction(3, gp.friction_3);
  ballTypesVOProxy.updateFriction(4, gp.friction_4);

  ballTypesVOProxy.usePhysics(0, gp.usePhysics_0);
  ballTypesVOProxy.usePhysics(1, gp.usePhysics_1);
  ballTypesVOProxy.usePhysics(2, gp.usePhysics_2);
  ballTypesVOProxy.usePhysics(3, gp.usePhysics_3);
  ballTypesVOProxy.usePhysics(4, gp.usePhysics_4);

  ballTypesVOProxy.updateDeathVisualGood(0, gp.deathVisualGood_0);
  ballTypesVOProxy.updateDeathVisualGood(1, gp.deathVisualGood_1);
  ballTypesVOProxy.updateDeathVisualGood(2, gp.deathVisualGood_2);
  ballTypesVOProxy.updateDeathVisualGood(3, gp.deathVisualGood_3);
  ballTypesVOProxy.updateDeathVisualGood(4, gp.deathVisualGood_4);

  ballTypesVOProxy.updateDeathVisualBad(0, gp.deathVisualBad_0);
  ballTypesVOProxy.updateDeathVisualBad(1, gp.deathVisualBad_1);
  ballTypesVOProxy.updateDeathVisualBad(2, gp.deathVisualBad_2);
  ballTypesVOProxy.updateDeathVisualBad(3, gp.deathVisualBad_3);
  ballTypesVOProxy.updateDeathVisualBad(4, gp.deathVisualBad_4);

  ballTypesVOProxy.updateDeathSoundGood(0, gp.deathSoundGood_0);
  ballTypesVOProxy.updateDeathSoundGood(1, gp.deathSoundGood_1);
  ballTypesVOProxy.updateDeathSoundGood(2, gp.deathSoundGood_2);
  ballTypesVOProxy.updateDeathSoundGood(3, gp.deathSoundGood_3);
  ballTypesVOProxy.updateDeathSoundGood(4, gp.deathSoundGood_4);

  ballTypesVOProxy.updateDeathSoundBad(0, gp.deathSoundBad_0);
  ballTypesVOProxy.updateDeathSoundBad(1, gp.deathSoundBad_1);
  ballTypesVOProxy.updateDeathSoundBad(2, gp.deathSoundBad_2);
  ballTypesVOProxy.updateDeathSoundBad(3, gp.deathSoundBad_3);
  ballTypesVOProxy.updateDeathSoundBad(4, gp.deathSoundBad_4);

  ballTypesVOProxy.updateImageIndex(0, gp.imageIndex_0);
  ballTypesVOProxy.updateImageIndex(1, gp.imageIndex_1);
  ballTypesVOProxy.updateImageIndex(2, gp.imageIndex_2);
  ballTypesVOProxy.updateImageIndex(3, gp.imageIndex_3);
  ballTypesVOProxy.updateImageIndex(4, gp.imageIndex_4);
}
