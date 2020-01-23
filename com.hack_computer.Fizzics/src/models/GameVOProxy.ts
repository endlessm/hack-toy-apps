import { Proxy } from "@koreez/mvcx";
import { GameEvents } from "../constants/EventNames";
import { GameState } from "../constants/types";
import { GameVO } from "./GameVO";

export class GameVOProxy extends Proxy<GameVO> {
  constructor() {
    super(new GameVO());
  }

  public initialize(): void {
    this.vo.state = GameState.UNKNOWN;
  }

  public updateState(state: GameState): void {
    this.vo.state = state;
    this.facade.sendNotification(GameEvents.StateUpdate, this.vo.state);
  }
}
