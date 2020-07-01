import { Facade, Observant } from "@koreez/mvcx";
import { SceneEvents, LevelEvents, FlingerEvents, UIEvents, ToolsEvents, BallsEvents, GameEvents } from "../constants/EventNames";
import { FizzicsFacade } from "../FizzicsFacade";
import { LevelVOProxy } from "../models/LevelVOProxy";
import { BallsVOProxy } from "../models/BallsVOProxy";
import { LevelVO } from "../models/LevelVO";
import { GameScene } from "../scenes/GameScene";
import { SceneKey, ToolType, FlingerState } from "../constants/types";
import { BallView } from "../views/balls/BallView";
import { GameObjects } from "phaser";
import { UIScene } from "../scenes/UIScene";
import { Button } from "../utils/Button";
import { Tool } from "../views/ui/Tool";
import { BallTypeVO } from "../models/BallTypeVO";
import { BallVO } from "../models/BallVO";
import { ToolsVOProxy } from "../models/ToolsVOProxy";
import { BallTypesVOProxy } from "../models/BallTypesVOProxy";

export class CursorObservant extends Observant {
  private _ballsProxy: BallsVOProxy;
  _levelScene: GameScene;
  _gameScene: any;

  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this._subscribe(LevelEvents.LevelStart, this._onLevelStart);    
    this._subscribe(FlingerEvents.FlingStart, this._refreshCursor);
    this._subscribe(FlingerEvents.FlingEnd, this._refreshCursor);
    this._subscribe(ToolsEvents.ActiveToolUpdate, this._refreshCursor);
    this._subscribe(BallsEvents.PointerUp, this._refreshCursor);
    this._subscribe(BallsEvents.PointerDown, this._refreshCursor);
    this._subscribe(BallsEvents.CreatedByTool, this._onNewBall);
  }

  private _onNewBall(ball: BallVO): void {
      const game = window.fizzicsGame;
      const gameScene = <GameScene>game.scene.getScene(SceneKey.Game);
      const balls = gameScene.levelView.balls.values;

      balls.filter((b: BallView) => ball.id === b.id).forEach((b: BallView) => {
        b.on('pointerover', this._refreshCursor.bind(this));
        b.on('pointerout', this._onBallPointerOut.bind(this));
      });
  }

  private _onLevelStart(levelVO: LevelVO): void {  
    const game = window.fizzicsGame;
    const gameScene = <GameScene>game.scene.getScene(SceneKey.Game);
    const balls = gameScene.levelView.balls.values;

    balls.forEach((ball: BallView) => {
      ball.on('pointerover', this._refreshCursor.bind(this));
      ball.on('pointerout', this._onBallPointerOut.bind(this));
    });
  }

  private _onBallPointerOut() : void {
    const game = window.fizzicsGame;
    this._levelScene = <GameScene>game.scene.getScene(SceneKey.LevelComplete);
    if (this._levelScene.input.mousePointer.isDown)
      return;
    this._refreshCursor();
  }

  private _refreshCursor() : void {
    const toolsVOProxy = this.facade.retrieveProxy(ToolsVOProxy);
    const ballsVOProxy = this.facade.retrieveProxy(BallsVOProxy);
    const ballTypesVOProxy = this.facade.retrieveProxy(BallTypesVOProxy);
  
    const game = window.fizzicsGame;
    const gameScene = <GameScene>game.scene.getScene(SceneKey.Game);
    const levelScene = <GameScene>game.scene.getScene(SceneKey.LevelComplete);
    const flinger = gameScene.flingerView;
    const isMouseDown = gameScene.input.mousePointer.isDown;
  
    let cursor = toolsVOProxy.vo.activeTool === ToolType.CREATE ? 'crosshair' : 'default';
  
    const balls = gameScene.levelView.balls.values;
    balls.filter(ball => ball.hover).forEach((ball: BallView) => {
      const ballVO : BallVO = ballsVOProxy.vo.get(ball.id);
      if (!ballVO)
        return;
      const ballTypeVO : BallTypeVO = ballTypesVOProxy.getTypeConfig(ballVO.species);
  
      if (toolsVOProxy.vo.activeTool === ToolType.MOVE)
        cursor = isMouseDown ? 'grabbing' : 'grab';
      else if (toolsVOProxy.vo.activeTool === ToolType.FLING && !ballTypeVO.frozen)
        cursor = 'move';
      else if (toolsVOProxy.vo.activeTool === ToolType.REMOVE)
        cursor = 'not-allowed';
      else if (toolsVOProxy.vo.activeTool !== ToolType.CREATE && !ballTypeVO.frozen)
        cursor = 'pointer';
    });
  
    if (flinger.visible) {
      if (flinger.state === FlingerState.PULLING) {
        cursor = 'grab';
      }
      if (flinger.state === FlingerState.WAITING && flinger.flingHover) {
        cursor = 'grabbing';
      }
    }
  
    levelScene.input.setDefaultCursor(cursor);
 }
}
