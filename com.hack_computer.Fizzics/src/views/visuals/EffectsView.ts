import { Easings } from "../../constants/Easings";
import { SceneKey } from "../../constants/types";

export class EffectsView extends Phaser.GameObjects.Container {
  constructor() {
    super(window.fizzicsGame.scene.getScene(SceneKey.Game));
  }

  private _activeTween: Phaser.Tweens.Timeline[] = [];

  public cleanup(): void {
    this._activeTween.forEach((tween: Phaser.Tweens.Timeline) =>
      this._onTweenComplete(tween)
    );
    this._activeTween = [];
  }

  public show(
    position: Phaser.Geom.Point,
    frame: string,
    scale: number = 1
  ): void {
    const { x, y } = position;
    const img = this.scene.add.image(x, y, "fizzics", frame);
    this.scene.children.sendToBack(img);
    img.setAlpha(0);
    img.setScale(0);

    const tween = this.scene.tweens.timeline({
      targets: img,
      onComplete: this._onTweenComplete,
      tweens: [
        {
          ease: Easings.Circ.Out,
          duration: 400,
          alpha: 1,
          scaleX: scale,
          scaleY: scale,
          hold: 100
        },
        {
          ease: Easings.Circ.In,
          duration: 300,
          alpha: 0
        }
      ]
    });

    this._activeTween.push(tween);
  }

  private readonly _onTweenComplete = (timeline: Phaser.Tweens.Timeline) => {
    timeline.destroy();
    const target = timeline.data[0].targets[0];
    target.destroy();
  };
}
