import "./phaser";
import "./endless";
import { I18nPlugin } from "@koreez/phaser3-i18n";
import { NinePatchPlugin } from "@koreez/phaser3-ninepatch";
import { isNullOrUndefined } from "util";
import { SceneKey } from "./constants/types";
import { FizzicsFacade } from "./FizzicsFacade";
import { FizzicsGame } from "./FizzicsGame";
import { getScale } from "./utils/utils";

window.onload = () => {
  startGame();
};

// tslint:disable-next-line: export-name
export const TRANSFORM = {
  width: 0,
  height: 0,
  center: new Phaser.Geom.Point()
};

function startGame(): void {
  const gameConfig: GameConfig = {
    title: "Fizzics",
    type: Phaser.WEBGL,
    scale: {
      ...getScale()
    },
    backgroundColor: 0xffffff,
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
      global: [{ key: "NinePatchPlugin", plugin: NinePatchPlugin, start: true }],
      scene: [{ key: "i18nPlugin", mapping: "i18n", plugin: I18nPlugin }]
    }
  };

  window.fizzicsGame = new FizzicsGame(gameConfig);
  const startupInterval = setInterval(() => {
    if (!isNullOrUndefined(window.fizzicsGame.scene.getScene(SceneKey.Preload))) {
      FizzicsFacade.Instance.initialize(false);
      clearInterval(startupInterval);
    }
  });

  const { width, height } = window.fizzicsGame.scale;
  TRANSFORM.width = width;
  TRANSFORM.height = height;
  TRANSFORM.center.setTo(width / 2, height / 2);
}
