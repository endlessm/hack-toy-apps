import { LevelVOProxy } from "../../models/LevelVOProxy";
import { FlingerState, SceneKey, ToolType } from "../../constants/types";
import { GameScene } from "../../scenes/GameScene";
import { ToolsVOProxy } from "../../models/ToolsVOProxy";
import { BallView } from "../../views/balls/BallView";
import { BallsVOProxy } from "../../models/BallsVOProxy";
import { BallVO } from "../../models/BallVO";
import { BallTypesVOProxy } from "../../models/BallTypesVOProxy";
import { BallTypeVO } from "../../models/BallTypeVO";

export function refreshCursorCommand(): void {
  const toolsVOProxy = this.retrieveProxy(ToolsVOProxy);
  const ballsVOProxy = this.retrieveProxy(BallsVOProxy);
  const ballTypesVOProxy = this.retrieveProxy(BallTypesVOProxy);

  const game = window.fizzicsGame;
  const gameScene = <GameScene>game.scene.getScene(SceneKey.Game);
  const levelScene = <GameScene>game.scene.getScene(SceneKey.LevelComplete);
  const flinger = gameScene.flingerView;
  const isMouseDown = gameScene.input.mousePointer.isDown;

  let cursor = toolsVOProxy.vo.activeTool === ToolType.CREATE ? 'crosshair' : 'default';

  const balls = gameScene.levelView.balls.values;
  balls.filter(ball => ball.hover).forEach((ball: BallView) => {
    const ballVO : BallVO = ballsVOProxy.vo.get(ball.id);
    const ballTypeVO : BallTypeVO = ballTypesVOProxy.getTypeConfig(ballVO.species);

    if (toolsVOProxy.vo.activeTool === ToolType.MOVE)
      cursor = isMouseDown ? 'grabbing' : 'grab';
    else if (toolsVOProxy.vo.activeTool === ToolType.MOVE && !ballTypeVO.frozen)
      cursor = 'move';
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
