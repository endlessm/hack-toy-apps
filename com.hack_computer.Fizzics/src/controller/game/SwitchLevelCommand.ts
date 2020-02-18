import { LevelVOProxy } from "../../models/LevelVOProxy";
import { RawLevelsVOProxy } from "../../models/RawLevelsVOProxy";
import { startLevelCommand } from "./StartLevelCommand";
// import { PlayerVOProxy } from "../../models/PlayerVOProxy";

export function switchLevelCommand(e: string, increment: number): void {
  console.log('MANUQ switchLevelCommand');
  const levelsCount = this.retrieveProxy(RawLevelsVOProxy).vo.levels.length;
  const levelIndex = <number>this.retrieveProxy(LevelVOProxy).vo.index;
  const newLevelIndex = Math.min(levelsCount - 1, levelIndex + increment);

  // const playerVOProxy = this.retrieveProxy(PlayerVOProxy);
  // if (newLevelIndex > playerVOProxy.vo.unlockedLevelIndex)
  //   playerVOProxy.increaseUnlockedLevelIndex();

  this.executeCommand(e, startLevelCommand, newLevelIndex);
}
