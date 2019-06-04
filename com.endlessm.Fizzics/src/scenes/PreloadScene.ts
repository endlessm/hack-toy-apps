import { loadBitmapfonts, loadImages, loadJson, loadAtlases,  } from "../assetLoader";
import { Bitmapfonts, Images, Jsones, Atlases } from "../assets";
import { ProgressBar } from "../utils/ProgressBar";
import { AbstractScene } from "./AbstractScene";

export class PreloadScene extends AbstractScene {
  public i18n: { initialize(config: object, cb: Function): void };
  private _progressBar: ProgressBar

  public preload(): void {
    this._progressBar = new ProgressBar(this);
    this.add.existing(this._progressBar)

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
    loadJson(this, Jsones);
    loadAtlases(this, Atlases)

    this.load.on("progress", this._progressBar.setProgress, this._progressBar);
  }
}
