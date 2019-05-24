import { NinePatch } from "@koreez/phaser3-ninepatch";
import { Images } from "../../assets";
import {
  CREATE_TOOL_BOMB_BALL_OPTION_CONFIG,
  CREATE_TOOL_DIAMOND_BALL_OPTION_CONFIG,
  CREATE_TOOL_MAIN_BALL_OPTION_CONFIG,
  CREATE_TOOL_ROCK_BALL_OPTION_CONFIG,
  CREATE_TOOL_STAR_BALL_OPTION_CONFIG
} from "../../constants/constants";
import { BallTypes } from "../../constants/types";
import { ToolView } from "./ToolView";

export class CreateToolView extends ToolView {
  constructor(scene: Phaser.Scene, config: any) {
    super(scene, config);

    this._createMenu();
  }

  private _menu: Menu;

  public deselect(): void {
    super.deselect();
    this._hideMenu();
  }

  public select(): void {
    super.select();
    this._showMenu();
  }

  public updateActiveOption(option: BallTypes): void {
    this._menu.updateActiveOption(option);
  }

  private _showMenu(): void {
    this._menu.visible = true;
  }

  private _hideMenu(): void {
    this._menu.visible = false;
  }

  private _createMenu(): void {
    const menu = new Menu(this.scene);
    menu.on("onOptionClick", this._onMenuOptionClick, this);
    menu.setPosition(this.width * 1.3, 8);
    this.add((this._menu = menu));
  }

  private _onMenuOptionClick(option: BallTypes): void {
    this.emit("onOptionClick", option);
  }
}

class Option extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, config: any) {
    super(scene);

    const { frame, scale } = config;

    this._createBg(frame);
    this._createOverlay();
    this.deselect();
    this.setScale(scale);
    this.setSize(this.width * this.scaleX, this.height * this.scaleY + 2);
  }

  private _overlap: Phaser.GameObjects.Image;

  public deselect(): void {
    this._overlap.visible = false;
  }

  public select(): void {
    this._overlap.visible = true;
  }

  private _createBg(frame: string): void {
    const img = this.scene.add.image(0, 0, `ball-${frame}`);
    img.setInteractive();
    img.on("pointerdown", this._onDown, this);
    this.add((this._overlap = img));
  }

  private _createOverlay(): void {
    const img = this.scene.add.image(0, 0, Images.SpeciesSelection.Name);
    this.setSize(img.width, img.height);
    this.add((this._overlap = img));
  }

  private _onDown(): void {
    this.emit("onClick");
  }
}

class Menu extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);

    const mainOption = new Option(
      this.scene,
      CREATE_TOOL_MAIN_BALL_OPTION_CONFIG
    );
    const starOption = new Option(
      this.scene,
      CREATE_TOOL_STAR_BALL_OPTION_CONFIG
    );
    const bombOption = new Option(
      this.scene,
      CREATE_TOOL_BOMB_BALL_OPTION_CONFIG
    );
    const rockOption = new Option(
      this.scene,
      CREATE_TOOL_ROCK_BALL_OPTION_CONFIG
    );
    const diamondOption = new Option(
      this.scene,
      CREATE_TOOL_DIAMOND_BALL_OPTION_CONFIG
    );

    Phaser.Display.Align.To.BottomCenter(starOption, mainOption);
    Phaser.Display.Align.To.BottomCenter(bombOption, starOption);
    Phaser.Display.Align.To.BottomCenter(rockOption, bombOption);
    Phaser.Display.Align.To.BottomCenter(diamondOption, rockOption);

    mainOption.on("onClick", this._onMainOptionClick, this);
    starOption.on("onClick", this._onStarOptionClick, this);
    bombOption.on("onClick", this._onBombOptionClick, this);
    rockOption.on("onClick", this._onRockOptionClick, this);
    diamondOption.on("onClick", this._onDiamondOptionClick, this);

    const bgWidthPadding = 10;
    const bgHeightPadding = 20;
    const bgHeight =
      diamondOption.y - mainOption.y + mainOption.height + bgHeightPadding;
    //@ts-ignore
    const bg: NinePatch = this.scene.add.ninePatch(
      0,
      0,
      mainOption.width + bgWidthPadding,
      bgHeight,
      Images.ToolsBg.Name
    );
    bg.y = -(mainOption.width + bgHeightPadding - bg.height) / 2;
    bg.setAlpha(0.8);

    this._options = new Map([
      [BallTypes.MAIN, mainOption],
      [BallTypes.STAR, starOption],
      [BallTypes.BOMB, bombOption],
      [BallTypes.ROCK, rockOption],
      [BallTypes.DIAMOND, diamondOption]
    ]);

    this.add(bg);
    this.add(mainOption);
    this.add(starOption);
    this.add(bombOption);
    this.add(rockOption);
    this.add(diamondOption);
  }

  private readonly _options: Map<BallTypes, Option>;

  public updateActiveOption(optionType: BallTypes): void {
    this._options.forEach((option: Option, key: BallTypes) => {
      key === optionType ? option.select() : option.deselect();
    });
  }

  private _onMainOptionClick(): void {
    this.emit("onOptionClick", BallTypes.MAIN);
  }

  private _onStarOptionClick(): void {
    this.emit("onOptionClick", BallTypes.STAR);
  }

  private _onBombOptionClick(): void {
    this.emit("onOptionClick", BallTypes.BOMB);
  }

  private _onRockOptionClick(): void {
    this.emit("onOptionClick", BallTypes.ROCK);
  }

  private _onDiamondOptionClick(): void {
    this.emit("onOptionClick", BallTypes.DIAMOND);
  }
}
