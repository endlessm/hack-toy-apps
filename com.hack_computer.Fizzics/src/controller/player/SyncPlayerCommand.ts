import { isNullOrUndefined } from "util";
import { IRawPlayer } from "../../constants/types";
import { PlayerVOProxy } from "../../models/PlayerVOProxy";

export function syncPlayerCommand(e: string, state: object): void {
  if (!isNullOrUndefined(state)) {
    const playerVOProxy = this.retrieveProxy(PlayerVOProxy)
    playerVOProxy.sync(<IRawPlayer>state);
  }
}
