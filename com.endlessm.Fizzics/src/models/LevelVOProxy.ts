import { Facade, Proxy } from "@koreez/mvcx";
import { ZERO } from "../constants/constants";
import { LevelEvents } from "../constants/EventNames";
import { IRawLevel, LevelState } from "../constants/types";
import { BallsVOProxy } from "./BallsVOProxy";
import { BallTypesVOProxy } from "./BallTypesVOProxy";
import { LevelVO } from "./LevelVO";
import { ToolsVOProxy } from "./ToolsVOProxy";

export class LevelVOProxy extends Proxy<LevelVO> {
  public initialize(levelIndex: number, rawLevel: IRawLevel): void {
    super.setVO(new LevelVO(rawLevel.ID, levelIndex));

    const toolsVOProxy = this.facade.retrieveProxy(ToolsVOProxy);
    const ballTypesVOProxy = this.facade.retrieveProxy(BallTypesVOProxy);
    const ballsVOProxy = this.facade.retrieveProxy(BallsVOProxy);

    toolsVOProxy.initialize();
    ballTypesVOProxy.initialize();
    ballsVOProxy.initialize(rawLevel.balls);

    this.updateDiamonds(ZERO);
    this.updateFlings(ZERO);
    this.updateState(LevelState.PLAY);

    this.facade.sendNotification(LevelEvents.LevelCreated);
  }

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this.facade.registerProxy(ToolsVOProxy);
    this.facade.registerProxy(BallTypesVOProxy);
    this.facade.registerProxy(BallsVOProxy);
  }

  public onRemove(): void {
    this.facade.removeProxy(BallsVOProxy);
    this.facade.removeProxy(BallTypesVOProxy);
    this.facade.removeProxy(ToolsVOProxy);
    super.onRemove();

    this.facade.sendNotification(LevelEvents.LevelRemoved);
  }

  public updateState(state: LevelState): void {
    this.vo.state = state;
    this.facade.sendNotification(LevelEvents.StateUpdate, this.vo.state);
  }

  public updateDiamonds(increment: number): void {
    this.vo.diamonds += increment;
    this.facade.sendNotification(LevelEvents.DiamondsUpdate, this.vo.diamonds);
  }

  public updateFlings(value: number): void {
    this.vo.flings = value;
    this.facade.sendNotification(LevelEvents.FlingsUpdate, this.vo.flings);
  }

  public updateBackground(value: number): void {
    this.vo.backgroundImageIndex = value;
    this.facade.sendNotification(LevelEvents.BgIndexUpdate, this.vo.backgroundImageIndex);
  }

  public updateScore(value: number): void {
    this.vo.score = value;
    this.facade.sendNotification(LevelEvents.ScoreUpdate, this.vo.score);
  }
}
