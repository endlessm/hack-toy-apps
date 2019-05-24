import { inject, injectable } from "@robotlegsjs/core";
import { reaction } from "mobx";
import { GAME } from "../constants/constants";
import { BallTypes, GameState, IDPair, SceneKey } from "../constants/types";
import { GameModel } from "../models/GameModel";
import { PlayableModel } from "../models/playable/PlayableModel";
import { GameScene } from "../scenes/GameScene";
import { MainBallCollisionSignal } from "../signals/MainBallCollisionSignal";
import { isInBounds, loopRunnable, removeRunnable } from "../utils/utils";
import { BallView } from "../views/balls/BallView";

@injectable()
export class IntersectionManager {
  @inject(GAME)
  private readonly _game: Phaser.Game;

  @inject(GameModel)
  private readonly _gameModel: GameModel;

  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  @inject(MainBallCollisionSignal)
  private readonly _mainBallCollisionSignal: MainBallCollisionSignal;

  private _scene: GameScene;

  private _ballsOutOfBoundsTimer: Phaser.Time.TimerEvent;

  public initialize(): void {
    this._scene = this._game.scene.getScene(SceneKey.Game) as GameScene;

    reaction(() => this._gameModel.state, this._checkForState);
    reaction(() => this._playableModel.level, this._onNewLevelReady);
  }

  public start(): void {
    this._scene.matter.world.on("collisionstart", this._onCollisionStart, this);
  }

  public stop(): void {
    this._scene.matter.world.off("collisionstart", this._onCollisionStart, this);
  }

  private readonly _onNewLevelReady = () => {
    removeRunnable(this._ballsOutOfBoundsTimer);
    this._initializeOutOfBoundsTimers();
  };

  private _initializeOutOfBoundsTimers(): void {
    this._ballsOutOfBoundsTimer = loopRunnable(
      this._scene,
      2000,
      this._ballsOutOfBoundsCallback,
      this,
      false,
      this._scene.balls.values
    );
  }

  private _ballsOutOfBoundsCallback(balls: BallView[]): void {
    balls.forEach((ballView: BallView) => {
      const { x, y } = ballView.ball;
      if (!isInBounds(x, y)) {
        if (ballView.species === BallTypes.MAIN) {
          const { x: posX, y: posY } = ballView.getData("startPosition");
          ballView.ball.setPosition(posX, posY);
          ballView.ball.setVelocity(0, 0);
        } else {
          this._playableModel.level.removeBall(ballView.id);
        }
      }
    });
  }

  private readonly _checkForState = (state: GameState) => {
    switch (state) {
      case GameState.GAME:
        this.start();
        break;
      default:
        this.stop();
    }
  };

  private _onCollisionStart(event: any): void {
    event.pairs.forEach((pair: any) => {
      const { bodyA, bodyB } = pair;
      if (!bodyA.gameObject || !bodyB.gameObject) {
        const id1: number = bodyB.gameObject ? bodyB.gameObject.getData("id") : bodyA.gameObject.getData("id");
        if (this._playableModel.level.getBallType(id1) === BallTypes.MAIN) {
          this._mainBallCollisionSignal.dispatch(new IDPair(id1, undefined));
        }
        return;
      }

      this._checkForCollisionType(bodyA, bodyB);
    });
  }

  private _checkForCollisionType(bodyA: any, bodyB: any): void {
    const id1: number = bodyA.gameObject.getData("id");
    const id2: number = bodyB.gameObject.getData("id");
    const ball1Type = this._playableModel.level.getBallType(id1);
    const ball2Type = this._playableModel.level.getBallType(id2);

    if ((ball1Type !== BallTypes.MAIN && ball2Type !== BallTypes.MAIN) || ball1Type === ball2Type) {
      return;
    }

    const mainBallID = ball1Type === BallTypes.MAIN ? id1 : id2;
    const idPair = new IDPair(id1, id2);

    if (mainBallID === id2) {
      idPair.swap();
    }

    this._mainBallCollisionSignal.dispatch(idPair);
  }
}
