import { LevelVOProxy } from "../../models/LevelVOProxy";

export function updateLevelScoreCommand(e: string): void {
  const levelVOProxy = this.retrieveProxy(LevelVOProxy);
  const { score, diamonds, flings } = levelVOProxy.vo;
  levelVOProxy.updateScore(Math.max(0, score + diamonds - flings));
}
