import { IButtonConfig, IRawPlayer } from "./types";
export const raw = require("../../assets/jsones/GameLevels.json");

export const CANVAS_CONTAINER_ID: string = "canvas";

export const ZERO = 0.0;
export const ONE_HALF = 0.5;
export const FLINGER_INITIAL_JOLT = 6.0;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const RATIO = WIDTH / HEIGHT;

export const PLAYER_DEFAULTS: IRawPlayer = {
  unlockedLevel: 0
};

export const MAX_BALLS_COUNT = 110;

export const LEVEL_BAR_PREV_BUTTON_CONFIG: IButtonConfig = {
  hoverFrame: "prev_hover",
  upFrame: "prev_enabled",
  disableFrame: "prev_disabled"
};

export const LEVEL_BAR_NEXT_BUTTON_CONFIG: IButtonConfig = {
  hoverFrame: "prev_hover",
  upFrame: "prev_enabled",
  disableFrame: "prev_disabled",
  flipX: true
};

export const LEVEL_BAR_RETRY_BUTTON_CONFIG: IButtonConfig = {
  hoverFrame: "reset_hover",
  upFrame: "reset_enabled",
  disableFrame: "reset_disabled"
};

export const ToolSound = {
  fling: "fizzics/flingTool",
  move: "fizzics/moveTool",
  create: "fizzics/createTool",
  remove: "fizzics/trashTool"
};

export const LEVEL_DEFAULTS = {
  minRadius: 10.0,
  maxRadius: 100.0,
  minGravity: -50.0,
  maxGravity: 50.0,
  minCollision: 0.01,
  maxCollision: 0.2,
  minFriction: 0.0,
  maxFriction: 100.0,
  minSocialForce: -30.0,
  maxSocialForce: 30.0,

  flingToolActive: true,
  moveToolActive: true,
  createToolActive: true,
  deleteToolActive: true,

  flingToolDisabled: false,
  moveToolDisabled: false,
  createToolDisabled: false,
  deleteToolDisabled: false,

  createType0Disabled: false,
  createType1Disabled: false,
  createType2Disabled: false,
  createType3Disabled: false,
  createType4Disabled: false,

  backgroundImageIndex: 2,

  // MAIN
  imageIndex_0: 6,
  radius_0: 50,
  gravity_0: 0,
  usePhysics_0: true,
  collision_0: 0.15,
  friction_0: 15,
  socialForce_0_0: ZERO,
  socialForce_0_1: ZERO,
  socialForce_0_2: ZERO,
  socialForce_0_3: ZERO,
  socialForce_0_4: ZERO,
  touchDeath_0_0: 0,
  touchDeath_0_1: 0,
  touchDeath_0_2: 0,
  touchDeath_0_3: 0,
  touchDeath_0_4: 0,
  deathVisualGood_0: 2,
  deathVisualBad_0: 1,
  deathSoundGood_0: 4,
  deathSoundBad_0: 6,
  createSound_0: 0,
  deleteSound_0: 0,
  flySound_0: 0,
  successSound_0: 0,
  toolSound_0: 0,

  // STAR
  radius_1: 60,
  gravity_1: ZERO,
  imageIndex_1: 8,
  usePhysics_1: false,
  collision_1: 0.04,
  friction_1: 15,
  socialForce_1_0: ZERO,
  socialForce_1_1: ZERO,
  socialForce_1_2: ZERO,
  socialForce_1_3: ZERO,
  socialForce_1_4: ZERO,
  touchDeath_1_0: 0,
  touchDeath_1_1: 0,
  touchDeath_1_2: 0,
  touchDeath_1_3: 0,
  touchDeath_1_4: 0,
  deathVisualGood_1: 2,
  deathVisualBad_1: 1,
  deathSoundGood_1: 0,
  deathSoundBad_1: 0,
  createSound_1: 1,
  deleteSound_1: 1,
  flySound_1: 1,
  successSound_1: 1,
  toolSound_1: 1,

  // BOMB
  radius_2: 60,
  gravity_2: ZERO,
  imageIndex_2: 1,
  usePhysics_2: false,
  collision_2: 0.04,
  friction_2: 15,
  socialForce_2_0: ZERO,
  socialForce_2_1: ZERO,
  socialForce_2_2: ZERO,
  socialForce_2_3: ZERO,
  socialForce_2_4: ZERO,
  touchDeath_2_0: 0,
  touchDeath_2_1: 0,
  touchDeath_2_2: 0,
  touchDeath_2_3: 0,
  touchDeath_2_4: 0,
  deathVisualGood_2: 2,
  deathVisualBad_2: 1,
  deathSoundGood_2: 0,
  deathSoundBad_2: 0,
  createSound_2: 2,
  deleteSound_2: 2,
  flySound_2: 2,
  successSound_2: 2,
  toolSound_2: 2,

  // ROCK
  radius_3: 60,
  gravity_3: ZERO,
  imageIndex_3: 9,
  usePhysics_3: false,
  collision_3: 0.04,
  friction_3: 15,
  socialForce_3_0: ZERO,
  socialForce_3_1: ZERO,
  socialForce_3_2: ZERO,
  socialForce_3_3: ZERO,
  socialForce_3_4: ZERO,
  touchDeath_3_0: 0,
  touchDeath_3_1: 0,
  touchDeath_3_2: 0,
  touchDeath_3_3: 0,
  touchDeath_3_4: 0,
  deathVisualGood_3: 2,
  deathVisualBad_3: 1,
  deathSoundGood_3: 0,
  deathSoundBad_3: 0,
  createSound_3: 3,
  deleteSound_3: 3,
  flySound_3: 3,
  successSound_3: 3,
  toolSound_3: 3,

  // DIAMOND
  radius_4: 35,
  gravity_4: ZERO,
  imageIndex_4: 10,
  usePhysics_4: true,
  collision_4: 0.08,
  friction_4: 15,
  socialForce_4_0: ZERO,
  socialForce_4_1: ZERO,
  socialForce_4_2: ZERO,
  socialForce_4_3: ZERO,
  socialForce_4_4: ZERO,
  touchDeath_4_0: 0,
  touchDeath_4_1: 0,
  touchDeath_4_2: 0,
  touchDeath_4_3: 0,
  touchDeath_4_4: 0,
  deathVisualGood_4: 2,
  deathVisualBad_4: 1,
  deathSoundGood_4: 5,
  deathSoundBad_4: 0,
  createSound_4: 4,
  deleteSound_4: 4,
  flySound_4: 4,
  successSound_4: 4,
  toolSound_4: 4
};
