import { BallType } from "../constants/types";
import { BallVO } from "../models/BallVO";
import { BallsMap } from "../utils/BallsMap";
import { postRunnable } from "../utils/utils";
import { BallView } from "./balls/BallView";
import { DynamicContainer } from "./dynamics/DynamicContainer";
import { BallTypeVO } from "../models/BallTypeVO";

export class LevelView extends DynamicContainer {
  public balls: BallsMap<number, BallView>;

  constructor(scene: Phaser.Scene) {
    super(scene, "LevelViewMediator");
  }

  public build(balls: BallVO[], ballTypes: Map<BallType, BallTypeVO>): void {
    this.balls = new BallsMap();

    balls.forEach((ballModel: BallVO) => {
      this.addBall(ballModel, ballTypes.get(ballModel.species));
    });
  }

  public getBall(id: number): BallView {
    return this.balls.get(id);
  }

  public updateTypeRadius(ballType: BallType, value: number): void {
    const balls = this.balls.getValuesByType(ballType);
    balls.forEach((ball: BallView) => ball.updateRadius(value));
  }

  public updateTypeGravity(ballType: BallType, value: number): void {
    const balls = this.balls.getValuesByType(ballType);
    balls.forEach((ball: BallView) => ball.updateGravity(value));
  }

  public updateTypeBounce(ballType: BallType, value: number): void {
    const balls = this.balls.getValuesByType(ballType);
    balls.forEach((ball: BallView) => ball.updateBounce(Math.min(value * 5)));
  }

  public updateTypeFriction(ballType: BallType, value: number): void {
    const balls = this.balls.getValuesByType(ballType);
    balls.forEach((ball: BallView) => ball.updateFriction(value));
  }

  public updateTypeFrozen(ballType: BallType, value: boolean): void {
    const balls = this.balls.getKeysByType(ballType);
    balls.forEach((ballID: number) => this.updateBallFrozen(ballID, value));
  }

  public updateTypeFrameIndex(ballType: BallType, value: number): void {
    const balls = this.balls.getValuesByType(ballType);
    balls.forEach((ball: BallView) => ball.updateTexture(value));
  }

  public removeBall(id: number): BallView {
    const ballView = this.balls.get(id);
    ballView.setMass(0.000000000000001);
    ballView.setVisible(false);
    ballView.setData("positionBeforeDestroy", new Phaser.Geom.Point(ballView.x, ballView.y));
    ballView.setPosition(-200, -200);
    postRunnable(this.scene, this._destroyBall, this, ballView);

    return ballView;
  }

  public addBall(ballModel: BallVO, ballTypeModel: BallTypeVO): BallView {
    const ballView = new BallView(this.scene, ballModel, ballTypeModel);
    this.add(ballView);
    this.balls.set(ballView.id, ballView);

    return ballView;
  }

  public updateBallFrozen(ballID: number, value: boolean): void {
    const ball = this.balls.get(ballID);
    ball.updateFrozen(value);
  }

  public updateBallCollisionGroup(ballID: number, value: number): void {
    const ball = this.balls.get(ballID);
    ball.updateCollisionGroup(value);
  }

  public onBallFlingableUpdate(ballID: BallType, frozen: boolean): void {
    this.updateBallFrozen(ballID, frozen);
    this.bringBallToTop(ballID);
  }

  public bringBallToTop(ballID: number): void {
    const ball = this.balls.get(ballID);
    this.bringToTop(ball);
  }

  private _destroyBall(ballView: BallView): void {
    this.balls.remove(ballView.id);
    ballView.destroy();
  }
}
