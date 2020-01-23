import { LevelState } from "../constants/types";

export class LevelVO {
  public state: LevelState;

  public score: number;

  public flings: number;

  public diamonds: number;

  public backgroundImageIndex: number;

  public index: number;

  public id: number;

  constructor(ID: number, index: number) {
    this.id = ID;
    this.index = index;
    this.diamonds = 0;
    this.flings = 0;
    this.score = 10;
  }
}
