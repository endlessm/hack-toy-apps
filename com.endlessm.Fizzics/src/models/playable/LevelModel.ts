import { action, computed, observable } from "mobx";
import { Images } from "../../assets";
import { BallTypes, IBallTypeConfig, IRawBall, IRawLevel, LevelState } from "../../constants/types";
import { BallsMap } from "../../utils/BallsMap";
import { getEnumValues } from "../../utils/utils";
import { BallModel } from "../balls/BallModel";
import { ToolsModel } from "./ToolsModel";

export class LevelModel {
  constructor(index: number, rawLevel: IRawLevel) {
    const { ID, balls, preset } = rawLevel;

    this._id = ID;
    this._index = index;
    this._state = LevelState.PLAY;
    this._toolsModel = new ToolsModel(preset);
    this._flings = 0;
    this._diamonds = 0;
    this._score = 10;
    this._backgroundFrame = Images.Background2.Name;

    this._initializeBallTypeConfig();
    this._initializeBalls(balls);
    //
    // this.updateTypeProperties(BallTypes.MAIN, "gravityScale", 50);
    // setTimeout(() => {
    //   // this.updateTypeProperties(BallTypes.MAIN, "gravityScale", -50);
    //   // window.globalParameters.gravity_0 = 50;
    //   // window.globalParameters.gravity_0 = 50;
    // }, 1000);
  }

  private readonly _id: number;

  @observable
  private _ballTypeConfig: Map<BallTypes, IBallTypeConfig>;

  @observable
  private _state: LevelState;

  @observable
  private _score: number;

  @observable
  private readonly _index: number;

  @observable
  private readonly _backgroundFrame: string;

  @observable
  private _flings: number;

  @observable
  private _diamonds: number;

  private _balls: BallsMap<number, BallModel>;

  private readonly _toolsModel: ToolsModel;

  public addBall(rawBall: IRawBall): void {
    const ballModel = new BallModel(rawBall, this._ballTypeConfig.get(rawBall.species));
    this._balls.set(ballModel.id, ballModel);
  }

  public removeBall(id: number): void {
    this._balls.remove(id);
  }

  public createBall(id: number, type: BallTypes, x: number, y: number): void {
    const rawBall: IRawBall = {
      ID: id,
      x,
      y,
      species: type
    };
    this.addBall(rawBall);
  }

  @computed
  public get state(): LevelState {
    return this._state;
  }

  @computed
  public get backgroundFrame(): string {
    return this._backgroundFrame;
  }

  @computed
  public get flings(): number {
    return this._flings;
  }

  @computed
  public get diamonds(): number {
    return this._diamonds;
  }

  @computed
  public get index(): number {
    return this._index;
  }

  @computed
  public get score(): number {
    return this._score;
  }

  public get toolsModel(): ToolsModel {
    return this._toolsModel;
  }

  public get id(): number {
    return this._id;
  }

  public get balls(): BallsMap<number, BallModel> {
    return this._balls;
  }

  public get ballTypeConfig(): Map<BallTypes, IBallTypeConfig> {
    return this._ballTypeConfig;
  }

  @action
  public updateTypeProperties(type: BallTypes, propertyName: string, value: any): void {
    const typeConfig = this._ballTypeConfig.get(type);
    (typeConfig as any)[propertyName] = value;
    this._balls.getValuesByType(type).forEach((ballModel: BallModel) => ((ballModel as any)[propertyName] = value));
  }

  @action
  public updateState(state: LevelState): void {
    this._state = state;
  }

  @action
  public updateScore(): void {
    this._score += this._diamonds - this._flings;
  }

  @action
  public updateDiamonds(increment: number): void {
    this._diamonds += increment;
  }

  @action
  public updateFlings(increment: number): void {
    this._flings += increment;
  }

  @action
  public switchBallDrag(id: number, enable: boolean): void {
    const ball = this._balls.get(id);
    ball.draggable = enable ? enable : !ball.frozen;
  }

  @action
  public switchBallFling(id: number, enable: boolean): void {
    const ball = this._balls.get(id);
    ball.flingable = enable;
  }

  public getTypeConfig(specie: BallTypes): any {
    return this._ballTypeConfig.get(specie);
  }

  public getBallType(id: number): BallTypes {
    return this._balls.get(id).species;
  }

  private _initializeBalls(rawBalls: IRawBall[]): void {
    this._balls = new BallsMap();
    this._balls.setObservableKeys();
    rawBalls.forEach((ball: IRawBall) => {
      this.addBall(ball);
    });
  }

  private _initializeBallTypeConfig(): void {
    const gp = window.globalParameters;
    const ballTypes = getEnumValues(BallTypes);

    this._ballTypeConfig = new Map();

    ballTypes.forEach((type: BallTypes) => {
      this._ballTypeConfig.set(type, {
        //@ts-ignore
        radius: gp[`radius_${type}`],
        //@ts-ignore
        gravityScale: gp[`gravity_${type}`],
        //@ts-ignore
        friction: gp[`friction_${type}`],
        //@ts-ignore
        frameIndex: gp[`imageIndex_${type}`],
        //@ts-ignore
        bounce: gp[`collision_${type}`],
        //@ts-ignore
        visualGood: gp[`deathVisualGood_${type}`],
        //@ts-ignore
        visualBad: gp[`deathVisualBad_${type}`],
        //@ts-ignore
        soundGood: gp[`deathSoundGood_${type}`],
        //@ts-ignore
        soundBad: gp[`deathSoundBad_${type}`],
        //@ts-ignore
        frozen: !gp[`usePhysics_${type}`],
        //@ts-ignore
        createSound: gp[`createSound_${type}`],
        //@ts-ignore
        deleteSound: gp[`deleteSound_${type}`],
        //@ts-ignore
        flySound: gp[`flySound_${type}`],
        //@ts-ignore
        successSound: gp[`successSound_${type}`],
        //@ts-ignore
        toolSound: gp[`toolSound_${type}`],
        //@ts-ignore
        socialForce_0: gp[`socialForce_${type}_0`],
        //@ts-ignore
        socialForce_1: gp[`socialForce_${type}_1`],
        //@ts-ignore
        socialForce_2: gp[`socialForce_${type}_2`],
        //@ts-ignore
        socialForce_3: gp[`socialForce_${type}_3`],
        //@ts-ignore
        socialForce_4: gp[`socialForce_${type}_4`],
        //@ts-ignore
        touchDeath_0: gp[`touchDeath_${type}_0`],
        //@ts-ignore
        touchDeath_1: gp[`touchDeath_${type}_1`],
        //@ts-ignore
        touchDeath_2: gp[`touchDeath_${type}_2`],
        //@ts-ignore
        touchDeath_3: gp[`touchDeath_${type}_3`],
        //@ts-ignore
        touchDeath_4: gp[`touchDeath_${type}_4`]
      });
    });
  }
}
