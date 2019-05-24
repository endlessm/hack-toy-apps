import { NinePatch } from "@koreez/phaser3-ninepatch";
import { TRANSFORM } from "../..";
import { Bitmapfonts, Images } from "../../assets";
import {
  LEVEL_BAR_NEXT_BUTTON_CONFIG,
  LEVEL_BAR_PREVIEWS_BUTTON_CONFIG,
  LEVEL_BAR_RETRY_BUTTON_CONFIG
} from "../../constants/constants";
import { loopRunnable, removeRunnable } from "../../utils/utils";
import { AbstractView } from "../AbstractView";

export class LevelBar extends AbstractView {
  private _levelLabel: Phaser.GameObjects.BitmapText;
  private _diamondLabel: Phaser.GameObjects.BitmapText;
  private _flingLabel: Phaser.GameObjects.BitmapText;
  private _prevButton: Button;
  private _nextButton: Button;
  private _retryButton: Button;

  public build() {
    const { width } = TRANSFORM;

    // __LEVEL SWITCHER__
    const levelBg = this._getCornerBg("left", width * 0.138);

    const levelLabel = this.scene.add.bitmapText(0, 0, Bitmapfonts.HelveticaRegular.Name, " ", 26).setOrigin(0.5);

    const prev = new Button(this.scene, LEVEL_BAR_PREVIEWS_BUTTON_CONFIG);
    prev.on("onClick", this._onPrevClick, this);

    const next = new Button(this.scene, LEVEL_BAR_NEXT_BUTTON_CONFIG);
    next.on("onClick", this._onNextClick, this);

    const retry = new Button(this.scene, LEVEL_BAR_RETRY_BUTTON_CONFIG);
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
    const diamondIcon = this.scene.add.image(0, 0, Images.DiamondsIcon.Name);
    const diamondLabel = this.scene.add.bitmapText(0, 0, Bitmapfonts.HelveticaRegular.Name, " ", 26).setOrigin(0.5);

    Phaser.Display.Align.To.RightCenter(diamondBg, levelBg, 4, -1);
    Phaser.Display.Align.In.LeftCenter(diamondIcon, diamondBg, -15);
    Phaser.Display.Align.In.RightCenter(diamondLabel, diamondBg, -25);

    this.add(diamondBg);
    this.add(diamondIcon);
    this.add((this._diamondLabel = diamondLabel));

    // __FLING__
    const flingBg = this._getCornerBg("right", width * 0.062);
    const flingIcon = this.scene.add.image(0, 0, Images.FlingsIcon.Name);
    const flingLabel = this.scene.add.bitmapText(0, 0, Bitmapfonts.HelveticaRegular.Name, " ", 26).setOrigin(0.5);

    Phaser.Display.Align.To.RightCenter(flingBg, diamondBg, 4, 1);
    Phaser.Display.Align.In.LeftCenter(flingIcon, flingBg, -17);
    Phaser.Display.Align.In.RightCenter(flingLabel, flingBg, -33);

    this.add(flingBg);
    this.add(flingIcon);
    this.add((this._flingLabel = flingLabel));

    //
    const thisHeight = levelBg.displayHeight;
    const thisWidth = flingBg.x + flingBg.width / 2 - (levelBg.x - levelBg.width / 2);
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
        frame = Images.LevelBg.Name;
        break;
      case "right":
        frame = Images.FlingBg.Name;
        break;
      case "center":
        frame = Images.DiamondBg.Name;
        height = 56;
        break;
    }

    // @ts-ignore
    const bg = this.scene.add.ninePatch(0, 0, width, height, frame);
    bg.setAlpha(0.6);
    bg.setPosition(bg.width / 2, bg.height / 2);
    return bg;
  }
}

class Button extends Phaser.GameObjects.Image {
  private _config: any;
  private _enabled: boolean;
  private _blinkTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, config: any) {
    const { upFrame } = config;
    super(scene, 0, 0, upFrame);

    this._initialize(config);

    this.on("pointerdown", this._onUp, this);
    this.on("pointerover", this._onOver, this);
    this.on("pointerout", this._onOut, this);

    this.enable();
  }

  public startBlink(): void {
    this._blinkTimer = loopRunnable(this.scene, 400, this._onBlinkTimerTick, this, true);
  }

  public stopBlink(): void {
    removeRunnable(this._blinkTimer);
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  private _initialize(config: any): void {
    this._config = config;

    const { flip } = this._config;
    flip && this.setFlip(flip, flip);
  }

  private _onBlinkTimerTick(): void {
    this.texture.key === this._config.upFrame ? this._onOver() : this._onOut();
  }

  private _onOver(): void {
    this.setTexture(this._config.hoverFrame);
  }

  private _onOut(): void {
    this.setTexture(this._config.upFrame);
  }

  private _onUp(): void {
    this.emit("onClick");
  }

  public get isEnabled(): boolean {
    return this._enabled;
  }

  private set enabled(value: boolean) {
    this._enabled = value;
    if (value) {
      this.setTexture(this._config.upFrame);
      this.setInteractive();
    } else {
      this.removeInteractive();
      this.setTexture(this._config.disableFrame);
    }
  }
}
