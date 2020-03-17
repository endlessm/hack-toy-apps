import { BallType } from "../../constants/types";
import { MatterImage } from "../../utils/MatterImage";

export class BallView extends MatterImage {
  public readonly id: number;
  public readonly species: BallType;
  private _hover: boolean;

  constructor(scene: Phaser.Scene, id: number, species: BallType, x: number, y: number) {
    super(scene.matter.world, x, y, "fizzics", "ball_0");

    this.id = id;
    this.species = species;
    this._hover = false;

    this.setCircle(this.displayWidth * 0.43, {});
    this.setScale(0.1);
    this.setInteractive();

    this.on('pointerover', this._onPointerOver);
    this.on('pointerout', this._onPointerOut);
  }

  public updateTexture(imageIndex: number): void {
    this.setFrame(`ball_${imageIndex}`);
  }

  public updateRadius(radius: number): void {
    const scale = radius / (this.width / 2);
    this.setScale(scale);
  }

  public updateGravity(gravityScale: number): void {
    this.setGravityScale(gravityScale * 0.1);
  }

  public updateBounce(bounce: number): void {
    this.setBounce(bounce);
  }

  public updateFriction(friction: number): void {
    this.setFrictionAir(friction * 0.001);
  }

  public updateFrozen(frozen: boolean): void {
    this.setStatic(frozen);
  }

  public updateCollisionGroup(collisionGroup: number): void {
    this.setCollidesWith(collisionGroup);
  }

  private _onPointerOver() : void {
    this._hover = true;
  }

  private _onPointerOut() : void {
    this._hover = false;
  }

  get hover() : boolean {
    return this._hover;
  }
}
