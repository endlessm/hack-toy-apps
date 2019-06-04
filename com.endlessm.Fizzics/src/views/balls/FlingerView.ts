import { GameScene } from "../../scenes/GameScene";
import { lineAngle } from "../../utils/utils";
import { DynamicContainer } from "../dynamics/DynamicContainer";
import { BallView } from "./BallView";

export class FlingerView extends DynamicContainer {
  public scene: GameScene;

  constructor(scene: Phaser.Scene) {
    super(scene, "FlingerViewMediator");
  }

  private static readonly MIN_DISTANCE = 100;
  private static readonly FLING_IMG_DEVIANT = 95;
  private _ball: BallView;
  private _fling: Phaser.GameObjects.Image;
  private _rectPath: Phaser.GameObjects.Rectangle;
  private _line1: Phaser.GameObjects.Line;
  private _line2: Phaser.GameObjects.Line;
  private _line1Arc: Phaser.GameObjects.Arc;
  private _line2Arc: Phaser.GameObjects.Arc;
  private _lineGroup: Phaser.GameObjects.Container;
  private _minDistanceReached: boolean;
  private readonly _flingUpPoint: Phaser.Geom.Point = new Phaser.Geom.Point();

  public build(): void {
    this.setSize(260, 260);
    this._createComponents();
    this._createFlingImage();
    this.stop();
  }

  public reset(): void {
    this.setRotation(0);
    this._fling.setPosition(0, 0);
    this._line1.setTo(0, 0, 0, 0);
    this._line2.setTo(0, 0, 0, 0);
    this._fling.off("pointerup", this._onFlingUp, this, true);
    this._fling.once("pointerup", this._onFlingUp, this);
    this.scene.input.off("pointermove", this._onFlingDrag, this, false);
    this._stopDistanceCheck();

    this.emit("flingReset");
  }

  public stop(): void {
    this.visible = false;
    this.reset();
  }

  public start(ballView: BallView): void {
    this.reset();

    this._rectPath.height = 0;

    // DEPTH SORTING
    this.scene.children.bringToTop(this);

    // INITIALIZE BALL
    this._ball = ballView;

    // INITIALIZE FLINGER
    this.visible = true;
    this.setPosition(this._ball.x, this._ball.y);

    this.setScale(
      //@ts-ignore
      (this._ball.body.circleRadius / (this._fling.width / 2)) * 1.7
    );
  }

  private _updateLines(): void {
    const { x, y, width, height } = this._rectPath;
    this._line1.setTo(x - width / 2, y, x - width / 2, y + height);
    this._line2.setTo(x + width / 2, y, x + width / 2, y + height);

    this._line1Arc.setPosition(x - width / 2, y);
    this._line2Arc.setPosition(x + width / 2, y);
    this._minDistanceReached = Math.abs(height) > FlingerView.MIN_DISTANCE;
    this._minDistanceReached ? this._lineGroup.setAlpha(0.7) : this._lineGroup.setAlpha(0.3);
  }

  private _startDistanceCheck(pointer: Phaser.Input.Pointer): void {
    this._flingUpPoint.setTo(pointer.x, pointer.y);
    this.scene.ticker.add(this._onTick);
  }

  private _stopDistanceCheck(): void {
    this.scene.ticker.remove(this._onTick);
  }

  private readonly _onTick = () => {
    const { x, y } = this._flingUpPoint;
    const distance = Phaser.Math.Distance.Between(x, y, this._ball.x, this._ball.y);
    if (
      distance >
      //@ts-ignore
      this._rectPath.height * this.scaleY + this._ball.body.circleRadius
    ) {
      this.reset();
      this.emit("ballReachedDistance", this._ball.id);
    }
  };

  private _createFlingImage(): void {
    const img: Phaser.GameObjects.Image = this.scene.add.image(0, 0, "fizzics", "flinger_active");
    img.setInteractive({ draggable: true });
    img.input.hitArea.height = img.height * 0.5;
    img.input.hitArea.y += img.height * 0.8;
    img.on("pointerover", this._onFlingOver, this);
    img.on("pointerout", this._onFlingOut, this);
    this.add((this._fling = img));
  }

  private _createComponents(): void {
    const lineGroup = this.scene.add.container(0, 0);

    const rect = this.scene.add.rectangle(0, 0, this.width * 0.88, 0, 0xffffff, 0);

    const line1 = this.scene.add.line(0, 0, 0, 0, 0, 0);
    const line2 = this.scene.add.line(0, 0, 0, 0, 0, 0);

    line1.setLineWidth(5, 5);
    line2.setLineWidth(5, 5);

    const arc1 = this.scene.add.arc(0, 0, 10);
    const arc2 = this.scene.add.arc(0, 0, 10);

    line1.setStrokeStyle(10, 0xffffff);
    line2.setStrokeStyle(10, 0xffffff);

    arc1.setFillStyle(0xffffff);
    arc2.setFillStyle(0xffffff);

    lineGroup.add((this._line1 = line1));
    lineGroup.add((this._line2 = line2));
    lineGroup.add((this._line1Arc = arc1));
    lineGroup.add((this._line2Arc = arc2));

    this.add((this._lineGroup = lineGroup));
    this.add((this._rectPath = rect));

    this._updateLines();
  }

  private _onFlingOver(): void {
    this._fling.setFrame("flinger_hover");
  }

  private _onFlingOut(): void {
    this._fling.setFrame("flinger_active");
  }

  private _onFlingDrag(pointer: Phaser.Input.Pointer, dragX?: number, dragY?: number): void {
    const angle = lineAngle(this.x, this.y, pointer.x, pointer.y);
    this.setRotation(angle);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, pointer.x, pointer.y);
    this._rectPath.height = distance / this.scaleX - FlingerView.FLING_IMG_DEVIANT;
    this._fling.y = this._rectPath.height;
    this._ball.x = pointer.x + Math.sin(angle) * FlingerView.FLING_IMG_DEVIANT * this.scaleX;
    this._ball.y = pointer.y - Math.cos(angle) * FlingerView.FLING_IMG_DEVIANT * this.scaleY;
    this._updateLines();

    this.emit("flingDistanceChange", distance);
  }

  private _onFlingUp(pointer: Phaser.Input.Pointer): void {
    this._fling.once("pointerup", this._onFling, this);
    this.scene.input.on("pointermove", this._onFlingDrag, this);
    this.emit("flingStart", this._ball.id);
  }

  private _onFling(pointer: Phaser.Input.Pointer): void {
    this.scene.input.off("pointermove", this._onFlingDrag, this, false);

    if (this._minDistanceReached) {
      const diffX = this.x - this._ball.x;
      const diffY = this.y - this._ball.y;
      this._ball.setVelocity(diffX / 10, diffY / 10);
      this.emit("flingEnd", this._ball.id);
      this._startDistanceCheck(pointer);
    } else {
      this._ball.setPosition(this.x, this.y);
      this.reset();
    }
  }
}
