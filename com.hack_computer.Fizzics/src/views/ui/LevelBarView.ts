import { NinePatch } from "@koreez/phaser3-ninepatch";
import { TRANSFORM } from "../..";
import {
  LEVEL_BAR_NEXT_BUTTON_CONFIG,
  LEVEL_BAR_PREV_BUTTON_CONFIG,
  LEVEL_BAR_RETRY_BUTTON_CONFIG
} from "../../constants/constants";
import { Button } from "../../utils/Button";
import { loopRunnable, removeRunnable } from "../../utils/utils";
import { DynamicContainer } from "../dynamics/DynamicContainer";

export class LevelBarView extends DynamicContainer {
  constructor(scene: Phaser.Scene) {
    super(scene, `LevelBarViewMediator`);
  }

  private _levelLabel: Phaser.GameObjects.BitmapText;
  private _diamondLabel: Phaser.GameObjects.BitmapText;
  private _flingLabel: Phaser.GameObjects.BitmapText;
  private _prevButton: Button;
  private _nextButton: Button;
  private _retryButton: RetryButton;

  public build(): void {
    const { width } = TRANSFORM;

    // __LEVEL SWITCHER__
    const levelBg = this._getCornerBg("left", width * 0.138);

    const levelLabel = this.scene.add
      .bitmapText(0, 0, "helvetica_regular", " ", 26)
      .setOrigin(0.5);

    const prev = new Button(this.scene, LEVEL_BAR_PREV_BUTTON_CONFIG);
    prev.on("onClick", this._onPrevClick, this);

    const next = new Button(this.scene, LEVEL_BAR_NEXT_BUTTON_CONFIG);
    next.on("onClick", this._onNextClick, this);

    const retry = new RetryButton(this.scene, LEVEL_BAR_RETRY_BUTTON_CONFIG);
    retry.on("onClick", this._onRetryClick, this);

    Phaser.Display.Align.In.Center(levelLabel, levelBg, -20);
    Phaser.Display.Align.In.LeftCenter(prev, levelBg, -5, -2);
    Phaser.Display.Align.In.RightCenter(next, levelBg, -1);
    Phaser.Display.Align.To.LeftCenter(retry, next, -2, -1);

    this.add(levelBg);
    this.add((this._levelLabel = levelLabel));
    this.add((this._prevButton = prev));
    this.add((this._nextButton = next));
    this.add((this._retryButton = retry));

    // __DIAMONDS__
    const diamondBg = this._getCornerBg("center", width * 0.053);
    const diamondIcon = this.scene.add.image(0, 0, "fizzics", "diamonds_icon");
    const diamondLabel = this.scene.add
      .bitmapText(0, 0, "helvetica_regular", " ", 26)
      .setOrigin(0.5);

    Phaser.Display.Align.To.RightCenter(diamondBg, levelBg, 4, -1);
    Phaser.Display.Align.In.LeftCenter(diamondIcon, diamondBg, -15);
    Phaser.Display.Align.In.RightCenter(diamondLabel, diamondBg, -25);

    this.add(diamondBg);
    this.add(diamondIcon);
    this.add((this._diamondLabel = diamondLabel));

    // __FLING__
    const flingBg = this._getCornerBg("right", width * 0.062);
    const flingIcon = this.scene.add.image(0, 0, "fizzics", "flings_icon");
    const flingLabel = this.scene.add
      .bitmapText(0, 0, "helvetica_regular", " ", 26)
      .setOrigin(0.5);

    Phaser.Display.Align.To.RightCenter(flingBg, diamondBg, 4, 1);
    Phaser.Display.Align.In.LeftCenter(flingIcon, flingBg, -17);
    Phaser.Display.Align.In.RightCenter(flingLabel, flingBg, -33);

    this.add(flingBg);
    this.add(flingIcon);
    this.add((this._flingLabel = flingLabel));

    //
    const thisHeight = levelBg.displayHeight;
    const thisWidth =
      flingBg.x + flingBg.width / 2 - (levelBg.x - levelBg.width / 2);
    this.setSize(thisWidth, thisHeight);
  }

  public disablePrevButton(): void {
    this._prevButton.disable();
  }

  public disableNextButton(): void {
    this._nextButton.disable();
  }

  public enableButtons(): void {
    this._prevButton.enable();
    this._nextButton.enable();
  }

  public startResetButtonBlinking(): void {
    this._retryButton.startBlink();
  }

  public stopResetButtonBlinking(): void {
    this._retryButton.stopBlink();
  }

  public updateLevelIndex(value: number): void {
    //@ts-ignore
    this._levelLabel.setTranslationParameter(0, value);
    this._levelLabel.setText(`level`);
  }

  public updateDiamonds(value: number): void {
    this._diamondLabel.setText(`${value}`);
  }

  public updateFlings(value: number): void {
    this._flingLabel.setText(`${value}`);
  }

  private _onPrevClick(): void {
    this.emit("prevClick");
  }

  private _onNextClick(): void {
    this.emit("nextClick");
  }

  private _onRetryClick(): void {
    this.emit("retryClick");
  }

  private _getCornerBg(dimension: string, width: number): NinePatch {
    let frame;
    let height = 58;
    switch (dimension) {
      case "left":
        frame = "level_bg";
        break;
      case "right":
        frame = "fling_bg";
        break;
      case "center":
        frame = "diamond_bg";
        height = 56;
      default:
    }

    // @ts-ignore
    const bg = this.scene.add.ninePatch(0, 0, width, height, "fizzics", frame);
    bg.setAlpha(0.6);
    bg.setPosition(bg.width / 2, bg.height / 2);

    return bg;
  }
}


class RetryButton extends Button {
  private _blinkTimer: Phaser.Time.TimerEvent;

  public startBlink(): void {
    this._blinkTimer = loopRunnable(
      this.scene,
      400,
      this._onBlinkTimerTick,
      this,
      true
    );
  }

  public stopBlink(): void {
    removeRunnable(this._blinkTimer);
    this.onOut();
  }

  private _onBlinkTimerTick(): void {
    this.frame.name === this.config.upFrame ? this.onOver() : this.onOut();
  }
}
