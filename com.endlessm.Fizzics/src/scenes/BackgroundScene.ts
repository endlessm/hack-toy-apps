import { TRANSFORM } from "..";
import { AbstractScene } from "./AbstractScene";

export class BackgroundScene extends AbstractScene {
  private _bg: Phaser.GameObjects.Image;

  public build(): void {
    this._buildBg();
  }

  public updateBackground(imageIndex: number): void {
    this._bg.setTexture(`background_${imageIndex}`);
  }

  private _buildBg(): void {
    const { x, y } = TRANSFORM.center;
    this._bg = this.add.image(x, y, "");
  }
}
