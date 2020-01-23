import { GameState } from "../../constants/types";
import { GameVOProxy } from "../../models/GameVOProxy";

export function updateGameStateCommand(e: string, state: GameState): void {
  const gameVOProxy = this.retrieveProxy(GameVOProxy);
  gameVOProxy.updateState(state);
}
