import { TRANSFORM } from "..";

export class ProgressBar extends Phaser.GameObjects.Graphics {
  public setProgress(value: number): void {
    const { width, height } = TRANSFORM;
    this.clear();
    this.fillStyle(0xffffff, 1);
    this.fillRect(0, height * 0.9, width * value, height * 0.1);
  }
}
