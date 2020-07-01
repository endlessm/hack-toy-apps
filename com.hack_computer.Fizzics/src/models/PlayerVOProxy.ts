import { Proxy } from "@koreez/mvcx";
import { IRawPlayer } from "../constants/types";
import { PlayerVO } from "./PlayerVO";

export class PlayerVOProxy extends Proxy<PlayerVO> {
  constructor() {
    super(new PlayerVO());
  }

  public increaseUnlockedLevelIndex(): void {
    this.vo.unlockedLevelIndex += 1;
  }

  public getSavableData(): IRawPlayer {
    return {
      unlockedLevel: this.vo.unlockedLevelIndex + 1
    };
  }

  public sync(data: IRawPlayer): void {
    const { unlockedLevel = this.vo.unlockedLevelIndex } = data;
    this.vo.unlockedLevelIndex = unlockedLevel - 1;
  }
}
