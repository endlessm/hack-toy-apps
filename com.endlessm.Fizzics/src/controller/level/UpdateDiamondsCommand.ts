import { LevelVOProxy } from "../../models/LevelVOProxy";

export function updateDiamondsCommand(e: string): void {
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  levelVOProxy.updateDiamonds(2);
}
