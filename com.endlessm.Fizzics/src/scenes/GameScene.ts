import { BallTypes } from "../constants/types";
import { BallModel } from "../models/balls/BallModel";
import { BallsMap } from "../utils/BallsMap";
import { FlingerView } from "../utils/FlingerView";
import { Ticker } from "../utils/Ticker";
import { BallView } from "../views/balls/BallView";
import { AbstractScene } from "./AbstractScene";

export class GameScene extends AbstractScene {
  private readonly _balls: BallsMap<number, BallView> = new BallsMap();
  private readonly _ticker: Ticker = new Ticker();
  private _flinger: FlingerView;

  public get ticker(): Ticker {
    return this._ticker;
  }

  public get balls(): BallsMap<number, BallView> {
    return this._balls;
  }

  public build(): void {
    this._flinger = new FlingerView(this);
    this.add.existing(this._flinger);
  }

  public buildBalls(balls: BallModel[]): void {
    balls.forEach((ballModel: BallModel) => {
      const { id, species } = ballModel;
      this.addBall(id, species);
    });
  }

  public removeBall(id: number): void {
    const ballView = this._balls.get(id);
    ballView.destroy();
    this._balls.remove(id);
  }

  public addBall(id: number, species: BallTypes): void {
    const ballView = new BallView(this, id, species);
    this.add.existing(ballView);
    this._balls.set(ballView.id, ballView);
  }

  public cleanup(): void {
    this._balls.values.forEach((ballView: BallView) => ballView.destroy());
    this._balls.clear();
  }

  public update(time: number, delta: number): void {
    super.update(time, delta);
    this._ticker.update(time, delta);
  }
}
