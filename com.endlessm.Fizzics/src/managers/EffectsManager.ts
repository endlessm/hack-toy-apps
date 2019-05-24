import { inject, injectable } from "@robotlegsjs/core";
import { reaction } from "mobx";
import { Images } from "../assets";
import { GAME } from "../constants/constants";
import { Easings } from "../constants/Easings";
import { BallTypes, IDPair, SceneKey } from "../constants/types";
import { PlayableModel } from "../models/playable/PlayableModel";
import { GameScene } from "../scenes/GameScene";
import { BallRemovedByToolSignal } from "../signals/BallRemovedByToolSignal";
import { CollisionMainBombSignal } from "../signals/CollisionMainBombSignal";
import { CollisionMainDiamondSignal } from "../signals/CollisionMainDiamondSignal";
import { CollisionMainStarSignal } from "../signals/CollisionMainStarSignal";

@injectable()
export class EffectsManager {
  @inject(GAME)
  private readonly _game: Phaser.Game;

  @inject(PlayableModel)
  private readonly _playableModel: PlayableModel;

  @inject(CollisionMainBombSignal)
  private readonly _collisionMainBombSignal: CollisionMainBombSignal;

  @inject(CollisionMainDiamondSignal)
  private readonly _collisionMainDiamondSignal: CollisionMainDiamondSignal;

  @inject(CollisionMainStarSignal)
  private readonly _collisionMainStarSignal: CollisionMainStarSignal;

  @inject(BallRemovedByToolSignal)
  private readonly _ballRemovedByToolSignal: BallRemovedByToolSignal;

  private _scene: GameScene;

  private _activeTween: Phaser.Tweens.Timeline[] = [];

  public initialize(): void {
    this._collisionMainBombSignal.add(this._onCollisionMainBomb);
    this._collisionMainDiamondSignal.add(this._onCollisionMainDiamond);
    this._collisionMainStarSignal.add(this._onCollisionMainStar);
    this._ballRemovedByToolSignal.add(this._onBallRemovedFromTool);

    this._scene = this._game.scene.getScene(SceneKey.Game) as GameScene;
    reaction(() => this._playableModel.level, this._onNewLevelReady);
  }

  private readonly _onCollisionMainBomb = (idPair: IDPair) => {
    const typeConfig = this._playableModel.level.getTypeConfig(BallTypes.MAIN);
    this._ballCollision(idPair.id1, `collision-${typeConfig.visualBad}`);
  };

  private readonly _onCollisionMainDiamond = (idPair: IDPair) => {
    const typeConfig = this._playableModel.level.getTypeConfig(BallTypes.DIAMOND);
    this._ballCollision(idPair.id2, `collision-${typeConfig.visualGood}`);
  };

  private readonly _onCollisionMainStar = (idPair: IDPair) => {
    const typeConfig = this._playableModel.level.getTypeConfig(BallTypes.STAR);
    this._ballCollision(idPair.id1, `collision-${typeConfig.visualGood}`);
  };

  private readonly _onBallRemovedFromTool = (id: number) => {
    this._ballCollision(id, Images.DeleteBall.Name);
  };

  private readonly _onNewLevelReady = () => {
    this._activeTween.forEach((tween: Phaser.Tweens.Timeline) => this._onTweenComplete(tween));
    this._activeTween = [];
  };

  private _ballCollision(ballID: number, frame: string): void {
    const ballView = this._scene.balls.get(ballID);
    const { x, y } = ballView.ball;
    const img = this._scene.add.image(x, y, frame);
    this._scene.children.sendToBack(img);
    img.setAlpha(0);
    img.setScale(0);

    const tween = this._scene.tweens.timeline({
      targets: img,
      onComplete: this._onTweenComplete,
      tweens: [
        {
          ease: Easings.Circ.Out,
          duration: 400,
          alpha: 1,
          scaleX: 1,
          scaleY: 1,
          hold: 100
        },
        {
          ease: Easings.Circ.In,
          duration: 300,
          alpha: 0
        }
      ]
    });

    this._activeTween.push(tween);
  }

  private readonly _onTweenComplete = (timeline: Phaser.Tweens.Timeline) => {
    timeline.destroy();
    const target = timeline.data[0].targets[0];
    target.destroy();
  };
}
