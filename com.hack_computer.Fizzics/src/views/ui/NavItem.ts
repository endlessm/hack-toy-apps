export abstract class NavItem<T> extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, t: T) {
    super(scene);

    this._t = t;
    this._createBg();
    this.enable();
  }

  public get defaultFrame(): string {
    return "";
  }

  protected bg: Phaser.GameObjects.Image;

  private readonly _t: T;

  public get t(): T {
    return this._t;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public abstract select(): void;

  public abstract deselect(): void;

  public enable(): void {
    this.bg.setInteractive();
    this.alpha = 1;
  }

  public disable(): void {
    this.bg.removeInteractive();
    this.alpha = 0.5;
  }

  protected onDown(): void {
    this.emit("onClick", this.t);
  }

  private _createBg(): void {
    const bg = this.scene.add.image(0, 0, "fizzics", this.defaultFrame);
    bg.on("pointerdown", this.onDown, this);

    this.add((this.bg = bg));
    this.setSize(bg.width, bg.height);
  }
}
