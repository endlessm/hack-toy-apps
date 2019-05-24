import { computed, observable } from "mobx";
import { BallTypes, IRawBall } from "../../constants/types";

export class BallModel {
  constructor(rawBall: IRawBall, config: any) {
    const { ID, x, y, species } = rawBall;
    this._id = ID;
    this._x = x;
    this._y = y;
    this._species = species;

    const { frameIndex, radius, frozen, gravityScale, friction, bounce } = config;
    this._frameIndex = frameIndex;
    this._radius = radius;
    this._frozen = frozen;
    this._bounce = bounce;
    this._gravityScale = gravityScale;
    this._friction = friction;
    this._collisionGroup = 1;
  }

  public get id(): number {
    return this._id;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get species(): BallTypes {
    return this._species;
  }

  public get draggable(): boolean {
    return this._draggable;
  }

  public set draggable(value: boolean) {
    this._draggable = value;
  }

  @computed
  public get frameIndex(): string {
    return this._frameIndex;
  }
  public set frameIndex(value: string) {
    this._frameIndex = value;
  }

  @computed
  public get radius(): number {
    return this._radius;
  }
  public set radius(value: number) {
    this._radius = value;
  }

  @computed
  public get frozen(): boolean {
    return this._frozen;
  }
  public set frozen(value: boolean) {
    this._frozen = value;
  }

  @computed
  public get bounce(): number {
    return this._bounce;
  }
  public set bounce(value: number) {
    this._bounce = value;
  }

  @computed
  public get gravityScale(): number {
    return this._gravityScale;
  }
  public set gravityScale(value: number) {
    this._gravityScale = value;
  }

  @computed
  public get collisionGroup(): number {
    return this._collisionGroup;
  }
  public set collisionGroup(value: number) {
    this._collisionGroup = value;
  }

  @computed
  public get friction(): number {
    return this._friction;
  }
  public set friction(value: number) {
    this._friction = value;
  }

  @computed
  public get flingable(): boolean {
    return this._flingable;
  }
  public set flingable(value: boolean) {
    this._flingable = value;
    this._collisionGroup = value ? 0 : 1;
  }

  private readonly _id: number;

  private readonly _x: number;

  private readonly _y: number;

  private readonly _species: BallTypes;

  @observable
  protected _frameIndex: string;

  @observable
  protected _radius: number;

  @observable
  protected _frozen: boolean;

  @observable
  protected _bounce: number;

  @observable
  protected _gravityScale: number;

  @observable
  protected _friction: number;

  @observable
  protected _collisionGroup: number;

  @observable
  private _draggable: boolean;

  @observable
  private _flingable: boolean;
}
