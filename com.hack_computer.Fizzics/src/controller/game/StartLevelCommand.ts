import { LEVEL_DEFAULTS } from "../../constants/constants";
import { LevelEvents } from "../../constants/EventNames";
import { IRawLevel, ToolType, LevelState } from "../../constants/types";
import { LevelVOProxy } from "../../models/LevelVOProxy";
import { RawLevelsVOProxy } from "../../models/RawLevelsVOProxy";
import { SoundObservant } from "../../observants/SoundObservant";
import { globalParametersSetupCommand } from "../level/GlobalParametersSetupCommand";
import { updateActiveToolCommand } from "../level/tools/UpdateActiveToolCommand";
import { updateLevelStateCommand } from "../level/UpdateLevelStateCommand";

export function startLevelCommand(e: string, levelIndex: number): void {
  const rawLevelsVOProxy = this.retrieveProxy(RawLevelsVOProxy);
  const rawLevel: IRawLevel = rawLevelsVOProxy.getLevel(levelIndex);

  this.sleepObservant(SoundObservant);
  this.removeProxy(LevelVOProxy);
  this.registerProxy(LevelVOProxy);

  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  levelVOProxy.initialize(levelIndex, rawLevel);

  const gp = window.globalParameters;
  Object.assign(gp, LEVEL_DEFAULTS);
  Object.assign(gp, rawLevel.preset);

  this.executeCommand(e, globalParametersSetupCommand);
  this.executeCommand(e, updateActiveToolCommand, ToolType.FLING);
  this.executeCommand(e, updateLevelStateCommand, LevelState.PLAY);

  this.wakeObservant(SoundObservant);

  this.sendNotification(LevelEvents.LevelStart, levelVOProxy.vo);
}
