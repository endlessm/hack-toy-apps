export interface IRawPlayer {
  unlockedLevel: number;
}

export interface IRawLevel {
  ID: number;
  preset: IRawPreset;
  balls: IRawBall[];
  collisionSpecies: number;
  numCollisionsGoal: number;
  period: number;
}

export interface IRawBall {
  ID: number;
  x: number;
  y: number;
  species: BallTypes;
}

export interface SoundData {
  good: string;
  bad: string;
}

export interface EffectData {
  good: string;
  bad: string;
}

export interface IRawPreset {
  disableToolsOnlyInFurthestLevel: boolean;
  flingToolDisabled: boolean;
  moveToolDisabled: boolean;
  createToolDisabled: boolean;
  deleteToolDisabled: boolean;
}

export interface IBallTypeConfig {
  radius: number;
  gravityScale: number;
  bounce: number;
  friction: number;
  frozen: false;
  visualGood: number;
  visualBad: number;
  soundGood: number;
  soundBad: number;
  frameIndex: number;
  socialForce_0: number;
  socialForce_1: number;
  socialForce_2: number;
  socialForce_3: number;
  socialForce_4: number;
  touchDeath_0: number;
  touchDeath_1: number;
  touchDeath_2: number;
  touchDeath_3: number;
  touchDeath_4: number;
}

export enum ToolType {
  FLING = "fling",
  DRAG = "drag",
  CREATE = "create",
  DELETE = "delete"
}

export enum SceneKey {
  Boot = "Boot",
  Preload = "Preload",
  Background = "Background",
  Game = "Game",
  UI = "UI",
  LEVEL_COMPLETE = "Level_Complete"
}
export enum GameState {
  UNKNOWN = "unknown",
  GAME = "game"
}
export enum LevelState {
  PLAY = "play",
  FAIL = "fail",
  COMPLETE = "complete"
}
export enum BallTypes {
  MAIN,
  STAR,
  BOMB,
  ROCK,
  DIAMOND
}

export class IDPair {
  constructor(public id1: number, public id2: number) {}

  public swap(): void {
    const id1 = this.id1;
    this.id1 = this.id2;
    this.id2 = id1;
  }
}
