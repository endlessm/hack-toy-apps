import { BallType } from "../../constants/types";
import { NavItem } from "./NavItem";

export class CreateToolOption extends NavItem<BallType> {
  constructor(scene: Phaser.Scene, t: BallType) {
    super(scene, t);

    this._createOutline();
  }

  private _outline: Phaser.GameObjects.Image;

  public get defaultFrame(): string {
    return `ball_${this.t}`;
  }

  public updateBgFrame(frameIndex: number): void {
    this.bg.setFrame(`ball_${frameIndex}`)
  }

  public select(): void {
    this._outline.visible = true;
  }

  public deselect(): void {
    this._outline.visible = false;
  }

  private _createOutline(): void {
    const img = this.scene.add.image(0, 0, "fizzics", "species_selection");
    img.setScale(1.1);
    this.setSize(img.displayWidth, img.displayHeight);
    this.add((this._outline = img));
  }
}
