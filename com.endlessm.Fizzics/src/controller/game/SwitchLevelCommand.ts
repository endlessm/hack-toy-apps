import { LevelVOProxy } from "../../models/LevelVOProxy";
import { RawLevelsVOProxy } from "../../models/RawLevelsVOProxy";
import { startLevelCommand } from "./StartLevelCommand";

export function switchLevelCommand(e: string, increment: number): void {
  const levelsCount = this.retrieveProxy(RawLevelsVOProxy).vo.levels.length;
  const levelIndex = <number>this.retrieveProxy(LevelVOProxy).vo.index;
  const newLevelIndex = Math.min(levelsCount - 1, levelIndex + increment);

  this.executeCommand(e, startLevelCommand, newLevelIndex);
}
