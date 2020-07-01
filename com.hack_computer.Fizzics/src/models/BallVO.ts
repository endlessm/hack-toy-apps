import { IRawBall } from "../constants/types";

export class BallVO {
  public id: number;

  public species: number;

  public x: number;

  public y: number;

  public collisionGroup: number;

  public flingable: boolean;

  public draggable: boolean;

  constructor(rawBall: IRawBall) {
    const { ID, x, y, species } = rawBall;
    this.id = ID;
    this.species = species;
    this.x = x;
    this.y = y;
    this.flingable = false;
    this.draggable = false;
    this.collisionGroup = 1;
  }
}
