import { Ticker } from "../utils/Ticker";
import { FlingerView } from "../views/balls/FlingerView";
import { LevelView } from "../views/LevelView";
import { AbstractScene } from "./AbstractScene";

export class GameScene extends AbstractScene {
  private _levelView: LevelView;

  private readonly _ticker: Ticker = new Ticker();
  private _flinger: FlingerView;

  public get ticker(): Ticker {
    return this._ticker;
  }

  public build(): void {
    this._flinger = new FlingerView(this);
    this.add.existing(this._flinger);
  }

  public buildLevel(): void {
    this._levelView = new LevelView(this);
    this.add.existing(this._levelView);
  }

  public destroyLevel(): void {
    this._levelView.destroy();
  }

  public update(time: number, delta: number): void {
    super.update(time, delta);
    this._ticker.update(time, delta);
  }
}
