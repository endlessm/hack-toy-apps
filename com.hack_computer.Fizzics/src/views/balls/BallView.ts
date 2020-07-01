import { BallType } from "../../constants/types";
import { MatterImage } from "../../utils/MatterImage";
import { BallTypeVO } from "../../models/BallTypeVO";
import { BallVO } from "../../models/BallVO";

export class BallView extends MatterImage {
  private static readonly MAX_ATTRACTION_DISTANCE = 300;

  public readonly id: number;
  public readonly species: BallType;
  private _ballTypeModel: BallTypeVO;
  private _hover: boolean;

  constructor(scene: Phaser.Scene, model: BallVO, typeModel: BallTypeVO) {
    super(scene.matter.world, model.x, model.y, "fizzics", "ball_0");

    this.id = model.id;
    this.species = model.species;
    this._ballTypeModel = typeModel;
    this._hover = false;
    this.setCircle(this.displayWidth * 0.43, {
      plugin: {
        attractors: [this.doAttraction.bind(this)]
      }
    });
    this.setScale(0.1);
    this.setInteractive();

    this.on('pointerover', this._onPointerOver);
    this.on('pointerout', this._onPointerOut);
  }

  private doAttraction(bodyA: any, bodyB: any) {
    const ballA = bodyA.gameObject;
    const ballB = bodyB.gameObject;
    const distance = Phaser.Math.Distance.Between(ballA.x, ballA.y, ballB.x, ballB.y);

    if (distance > BallView.MAX_ATTRACTION_DISTANCE)
      return;

    const scale = 1e-6;
    // There are two different options. Whether to scale the force value or to
    // make the attraction radius bigger. In this case, we scale the force value.
    //@ts-ignore
    const forceScale = this._ballTypeModel[`socialForce_${ballB.species}`];

    const x = (bodyA.position.x - bodyB.position.x) * scale * forceScale;
    const y = (bodyA.position.y - bodyB.position.y) * scale * forceScale;

    ballA.applyForce({x: -x, y: -y});
    ballB.applyForce({x, y});
  }

  public updateTexture(imageIndex: number): void {
    this.setFrame(`ball_${imageIndex}`);
  }

  public updateRadius(radius: number): void {
    const scale = radius / (this.width / 2);
    this.setScale(scale);
  }

  public updateGravity(gravityScale: number): void {
    this.setIgnoreGravity(gravityScale === 0);
    if (gravityScale !== 0) {
      this.setGravityScale(gravityScale * 0.1);
    }
  }

  public updateBounce(bounce: number): void {
    this.setBounce(bounce);
  }

  public updateFriction(friction: number): void {
    this.setFrictionAir(friction * 0.001);
  }

  public updateFrozen(frozen: boolean): void {
    if (this.isStatic() === frozen) {
      return;
    }

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
