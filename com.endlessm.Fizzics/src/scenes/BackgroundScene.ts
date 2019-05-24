import { TRANSFORM } from "..";
import { AbstractScene } from "./AbstractScene";

export class BackgroundScene extends AbstractScene {
  private _bg: Phaser.GameObjects.Image;

  public build(): void {
    this._buildBg();
  }

  public updateBackground(frame: string): void {
    this._bg.setTexture(frame);
  }

  private _buildBg() {
    const { x, y } = TRANSFORM.center;
    this._bg = this.add.image(x, y, "");
  }
}
