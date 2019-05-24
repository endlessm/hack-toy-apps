export class ToolView extends Phaser.GameObjects.Container {
  private _activeFrame: string;
  private _passiveFrame: string;
  private _bg: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, config: any) {
    super(scene);

    const { active, passive } = config;
    this._activeFrame = active;
    this._passiveFrame = passive;

    this._createBg();
    this.enable();
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public enable(): void {
    this._bg.setInteractive({ draggable: true });
    this.alpha = 1;
  }

  public disable(): void {
    this._bg.removeInteractive();
    this.alpha = 0.5;
  }

  public select(): void {
    this._bg.setTexture(this._activeFrame);
  }

  public deselect(): void {
    this._bg.setTexture(this._passiveFrame);
  }

  protected onDown(): void {
    this.emit("onClick");
  }

  private _createBg(): void {
    const bg = this.scene.add.image(0, 0, this._passiveFrame);
    this.setSize(bg.width, bg.height);
    bg.on("pointerdown", this.onDown, this);
    this.add((this._bg = bg));
  }
}
