import { NavItem } from "../views/ui/NavItem";

export enum ToolType {
  FLING = "fling",
  MOVE = "move",
  CREATE = "create",
  REMOVE = "remove"
}

export enum BallType {
  MAIN,
  STAR,
  BOMB,
  ROCK,
  DIAMOND
}

export interface IButtonConfig {
  upFrame: string;
  hoverFrame: string;
  disableFrame: string;
  flipX?: boolean;
}

export interface INavigationConfig {
  padding: { x: number; y: number };
  gap: number;
  items: NavItem<any>[];
  scale?: number;
}

export interface IRawPlayer {
  unlockedLevel: number;
}

export interface IRawLevel {
  ID: number;
  preset: IRawPreset;
  period: number;
  balls: IRawBall[];
  collisionSpecies: number;
  numCollisionsGoal: number;
}

export interface IRawBall {
  ID: number;
  x: number;
  y: number;
  species: BallType;
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
  flingToolActive: boolean;
  moveToolActive: boolean;
  createToolActive: boolean;
  deleteToolActive: boolean;
}

export interface IBallTypeConfig {
  radius: number;
  gravity: number;
  bounce: number;
  friction: number;
  frozen: boolean;
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


export enum SceneKey {
  Preload = "PreloadScene",
  Background = "BackgroundScene",
  Game = "GameScene",
  UI = "UIScene",
  LevelComplete = "LevelCompleteScene"
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

export class IDPair {
  constructor(public id1: number, public id2: number) {}

  public swap(): void {
    const id1 = this.id1;
    this.id1 = this.id2;
    this.id2 = id1;
  }
}

export interface IMatterCollisionPair {
  bodyA: IMatterBody;
  bodyB: IMatterBody;
}

export interface IMatterBody {
  id: number;
  gameObject: Phaser.GameObjects.GameObject;
}
