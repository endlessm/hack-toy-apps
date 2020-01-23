import { NinePatch } from "@koreez/phaser3-ninepatch";
import { TRANSFORM } from "..";
import { HEIGHT, WIDTH } from "../constants/constants";
import { AbstractScene } from "./AbstractScene";

export class LevelCompleteScene extends AbstractScene {
  private _diamondLabel: Phaser.GameObjects.BitmapText;
  private _flingLabel: Phaser.GameObjects.BitmapText;
  private _scoreLabel: Phaser.GameObjects.BitmapText;
  private _ballImage: Phaser.GameObjects.Image;

  public build(): void {
    const { center } = TRANSFORM;

    this._createBlocker();

    const bg = this._createBg(WIDTH * 0.2, HEIGHT * 0.6);
    bg.setPosition(center.x, bg.height / 2 + 100);

    const confetti = this.add.image(0, 0, "fizzics", "collision_10");

    const ball = this.add.image(0, 0, "fizzics", "ball_6");
    ball.setScale(0.52);

    const titleLabel = this.add.bitmapText(0, 0, "helvetica_regular", "you_won", 40).setOrigin(0.5);

    const scoreLabel = this.add.bitmapText(0, 0, "helvetica_regular", "score", 40).setOrigin(0.5);

    Phaser.Display.Align.In.TopCenter(confetti, bg);
    Phaser.Display.Align.In.Center(ball, confetti, 0, -10);
    Phaser.Display.Align.To.BottomCenter(titleLabel, confetti, 0, -50);
    Phaser.Display.Align.To.BottomCenter(scoreLabel, titleLabel, 0, 20);

    const diamondContainer = this._getResultComponent("diamonds_icon");
    const flingContainer = this._getResultComponent("flings_icon");

    Phaser.Display.Align.To.BottomCenter(diamondContainer, scoreLabel, 0, 34);
    Phaser.Display.Align.To.BottomCenter(flingContainer, scoreLabel, 0, 30);

    diamondContainer.x -= diamondContainer.width / 2 - bg.width * 0.15;
    flingContainer.x -= flingContainer.width / 2 + bg.width * 0.15;

    const nextBtn = this._createNextButton(bg.width * 0.5, 65);
    Phaser.Display.Align.In.BottomCenter(nextBtn, bg, 0, -70);

    this._ballImage = ball;
    this._scoreLabel = scoreLabel;
    this._diamondLabel = diamondContainer.getData("label");
    this._flingLabel = flingContainer.getData("label");
  }

  public updateBallImage(frameIndex: number): void {
    this._ballImage.setFrame(`ball_${frameIndex}`);
  }

  public updateScore(value: number): void {
    //@ts-ignore
    this._scoreLabel.setTranslationParameter(0, value);
  }

  public updateDiamonds(value: number): void {
    this._diamondLabel.setText(`${value}`);
  }

  public updateFlings(value: number): void {
    this._flingLabel.setText(`${value}`);
  }

  private _getResultComponent(iconsFrame: string): any {
    const icon = this.add.image(0, 0, "fizzics", iconsFrame);
    const label = this.add.bitmapText(0, 0, "helvetica_regular", "  ", 23).setOrigin(0, 0.5);
    const plus = this.add.bitmapText(0, 0, "helvetica_regular", "+", 23).setOrigin(0.5);
    Phaser.Display.Align.To.RightCenter(plus, icon, 20);
    Phaser.Display.Align.To.RightCenter(label, plus, 5, 2);
    const container = this.add.container(0, 0, [icon, plus, label]);
    container.setSize(label.x + label.width - icon.width / 2, icon.height);
    container.setData("label", label);
    return container;
  }

  private _createBg(width: number, height: number): NinePatch {
    return this.add.ninePatch(0, 0, width, height, "fizzics", "next_level_bg");
  }

  private _createBlocker(): void {
    const { width, height } = TRANSFORM;

    const img = this.add.ninePatch(0, 50, width, height, "fizzics", "next_level_bg");
    img.setInteractive();
    // TODO: replace with transparent pixel
    img.setAlpha(0.0000001);
  }

  private _createNextButton(width: number, height: number): Phaser.GameObjects.Container {
    const bg = this.add.ninePatch(0, 0, width, height, "fizzics", "next_level_button");
    bg.setInteractive();
    bg.on("pointerup", this._onNextClick, this);
    const label = this.add.bitmapText(0, 2, "helvetica_regular", "next_level", 25);
    label.setOrigin(0.5);

    const btn = this.add.container(0, 0, [bg, label]);
    return btn;
  }

  private _onNextClick(): void {
    this.events.emit("nextClick");
  }
}
