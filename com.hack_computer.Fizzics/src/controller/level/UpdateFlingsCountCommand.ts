import { LevelVOProxy } from "../../models/LevelVOProxy";

export function updateFlingsCountCommand(e: string, id: number): void {
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  levelVOProxy.updateFlings(levelVOProxy.vo.flings + 1);
}
