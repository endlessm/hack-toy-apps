import { LevelState } from "../../constants/types";
import { LevelVOProxy } from "../../models/LevelVOProxy";

export function levelFailedGuard(): boolean {
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);

  return levelVOProxy.vo.state === LevelState.FAIL;
}
