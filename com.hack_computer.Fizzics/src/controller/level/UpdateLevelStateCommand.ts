import { LevelState } from "../../constants/types";
import { LevelVOProxy } from "../../models/LevelVOProxy";

export function updateLevelStateCommand(e: string, state: LevelState): void {
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  levelVOProxy.updateState(state);
}
