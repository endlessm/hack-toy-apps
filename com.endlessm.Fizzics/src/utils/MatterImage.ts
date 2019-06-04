export class MatterImage extends Phaser.Physics.Matter.Image {
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number, 
    y: number,
    texture: string,
    frame?: string | number,
    options?: object
  ) {
    super(world, x, y, texture, frame, options);
  }

  public setBody(
    config: object,
    options: object
  ): Phaser.GameObjects.GameObject {
    super.setBody(config, options);

    //@ts-ignore
    this.body.gravityScale = 1;

    return this;
  }

  public setGravityScale(value: number): void {
    //@ts-ignore
    this.body.gravityScale = value;
  }
}
