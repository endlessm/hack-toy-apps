import { loadBitmapfonts, loadImages, loadJsons } from "../assetLoader";
import { Bitmapfonts, Images, Jsones } from "../assets";
import { AbstractScene } from "./AbstractScene";

export class PreloadScene extends AbstractScene {
  public i18n: { initialize(config: object, cb: Function): void };

  public preload(): void {
    this.i18n.initialize(
      {
        fallbackLng: "en",
        loadPath: "assets/locales/{{lng}}/{{ns}}.json",
        debug: false
      },
      () => {}
    );
    loadBitmapfonts(this, Bitmapfonts);
    loadImages(this, Images);
    loadJsons(this, Jsones);
  }
}
