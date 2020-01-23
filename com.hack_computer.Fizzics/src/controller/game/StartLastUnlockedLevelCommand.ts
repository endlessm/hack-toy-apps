import { PlayerVOProxy } from "../../models/PlayerVOProxy";
import { startLevelCommand } from "./StartLevelCommand";

export function startLastUnlockedLevelCommand(e: string): void {
  const playerVOProxy = this.retrieveProxy(PlayerVOProxy);
  this.executeCommand(
    e,
    startLevelCommand,
    playerVOProxy.vo.unlockedLevelIndex
  );
}
