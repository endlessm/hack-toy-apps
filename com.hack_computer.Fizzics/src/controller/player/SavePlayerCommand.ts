import { PlayerVOProxy } from "../../models/PlayerVOProxy";

export function savePlayerCommand(e: string): void {
  const playerVOProxy = this.retrieveProxy(PlayerVOProxy);
  window.saveState(playerVOProxy.getSavableData());
}
