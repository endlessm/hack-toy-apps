import { MAIN_BALL_DEFAULT_FRAME } from "../../constants/constants";
import { BallTypes } from "../../constants/types";
import { MatterImage } from "../../utils/MatterImage";

export class BallView extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, id: number, species: BallTypes) {
    super(scene);

    this._id = id;
    this._species = species;
    this._ball = new MatterImage(this.scene.matter.world, 0, 0, `ball-${MAIN_BALL_DEFAULT_FRAME}`);
    this._ball.setCircle(this._ball.displayWidth * 0.43, {});
    this._ball.setData("id", id);
    this.add(this._ball);
  }

  private readonly _id: number;
  private readonly _species: BallTypes;
  private readonly _ball: MatterImage;

  public get id(): number {
    return this._id;
  }

  public get species(): BallTypes {
    return this._species;
  }

  public get ball(): MatterImage {
    return this._ball;
  }

  public setStartPosition(x: number, y: number): void {
    this._ball.setPosition(x, y);
    this.setData("startPosition", { x: this.ball.x, y: this.ball.y });
  }

  public updateTexture(imageIndex: string): void {
    this._ball.setTexture(`ball-${imageIndex}`);
    this._ball.setInteractive();
  }

  public updateRadius(radius: number): void {
    this._ball.setScale(radius / (this._ball.width / 2));
  }

  public updateFrozen(frozen: boolean): void {
    this._ball.setStatic(frozen);
  }

  public updateBounce(bounce: number): void {
    this._ball.setBounce(bounce * 5);
  }

  public updateGravityScale(gravityScale: number): void {
    this._ball.setGravityScale(gravityScale * 0.1);
  }

  public updateFriction(friction: number): void {
    this._ball.setFrictionAir(friction * 0.001);
  }

  public updateCollisionGroup(collisionGroup: number): void {
    this._ball.setCollidesWith(collisionGroup);
  }

  public destroy(): void {
    this._ball.setMass(1 * 0.00000000001);
    super.destroy();
  }
}
