import { IButtonConfig } from "../constants/types";

export class Button extends Phaser.GameObjects.Image {
  protected config: IButtonConfig;

  constructor(scene: Phaser.Scene, config: IButtonConfig) {
    const { flipX, upFrame } = config;
    super(scene, 0, 0, "fizzics", upFrame);

    this.config = config;

    this.on("pointerdown", this.onUp, this);
    this.on("pointerover", this.onOver, this);
    this.on("pointerout", this.onOut, this);

    if (flipX) {
      this.setFlipX(true);
    }

    this.enable();
  }

  public enable(): void {
    this.setInteractive({ cursor: 'pointer'});
    this.setFrame(this.config.upFrame);
  }

  public disable(): void {
    this.removeInteractive();
    this.setFrame(this.config.disableFrame);
  }

  protected onOver(): void {
    this.setFrame(this.config.hoverFrame);
  }

  protected onOut(): void {
    this.setFrame(this.config.upFrame);
  }

  protected onUp(): void {
    this.emit("onClick");
  }
}
