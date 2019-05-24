/* tslint:disable:no-import-side-effect ordered-imports  */
import "reflect-metadata";
import "./endless";
import "./phaser";
import { I18nPlugin } from "@koreez/phaser3-i18n";
import { NinePatchPlugin } from "@koreez/phaser3-ninepatch";
import { CANVAS_CONTAINER_ID } from "./constants/constants";
import { FizzicsGame } from "./FizzicsGame";

window.onload = () => {
  startGame();
};

export const TRANSFORM: {
  width: number;
  height: number;
  center: Phaser.Geom.Point;
} = {
  width: 0,
  height: 0,
  center: new Phaser.Geom.Point()
};

function startGame(): void {
  //@ts-ignore
  const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Fizzics",
    type: Phaser.CANVAS,
    scale: {
      parent: CANVAS_CONTAINER_ID,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      mode: Phaser.Scale.FIT
    },
    width: 1920,
    height: 1080,
    backgroundColor: 0x626262,
    scene: [],
    banner: {
      hidePhaser: false,
      background: []
    },
    // @ts-ignore
    transparent: true,
    physics: {
      default: "matter",
      matter: {
        debug: false
      }
    },
    plugins: {
      global: [
        { key: "NinePatchPlugin", plugin: NinePatchPlugin, start: true }
      ],
      scene: [{ key: "i18nPlugin", mapping: "i18n", plugin: I18nPlugin }]
    }
  };

  // tslint:disable-next-line:no-unused-expression
  const fizzicsGame = new FizzicsGame(gameConfig);

  const { width, height } = fizzicsGame.scale;
  TRANSFORM.width = width;
  TRANSFORM.height = height;
  TRANSFORM.center.setTo(width / 2, height / 2);
}
