import { Images } from "../assets";
import { IRawPlayer } from "./types";

export const CANVAS_CONTAINER_ID: string = "canvas";
export const FIZZICS_STORAGE_KEY: string = "com_endlessm_fizzics";
export const GAME: string = "game";
export const ACTIVE_LEVEL: string = "active_level";
export const MAIN_BALL_TYPE: string = "main_ball_type";
export const STAR_BALL_TYPE: string = "star_ball_type";
export const DIAMOND_BALL_TYPE: string = "diamond_ball_type";
export const ROCK_BALL_TYPE: string = "rock_ball_type";
export const BOMB_BALL_TYPE: string = "bomb_ball_type";

export const MAIN_BALL_IDS: string = "main_balls_ids";
export const STAR_BALL_IDS: string = "star_balls_ids";
export const DIAMOND_BALL_IDS: string = "diamond_balls_ids";
export const ROCK_BALL_IDS: string = "rock_balls_ids";
export const BOMB_BALL_IDS: string = "bomb_balls_ids";

export const ZERO = 0.0;
export const ONE_HALF = 0.5;
export const ONE = 1.0;
export const PI2 = Math.PI * 2.0;
export const PI_OVER_180 = Math.PI / 180.0;
export const MILLISECONDS_PER_SECOND = 1000;

export const PLAYER_DEFAULTS: IRawPlayer = {
  unlockedLevel: 20
};

export const MAIN_BALL_DEFAULT_FRAME = 6;
export const ROCK_BALL_DEFAULT_FRAME = 9;
export const STAR_BALL_DEFAULT_FRAME = 8;
export const DIAMOND_BALL_DEFAULT_FRAME = 10;
export const BOMB_BALL_DEFAULT_FRAME = 1;

export const LEVEL_DEFAULTS = {
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
  deathSoundGood_0: 0,
  deathSoundBad_0: 0,
  createSound_0: 0,
  deleteSound_0: 0,
  flySound_0: 0,
  successSound_0: 0,
  toolSound_0: 0,

  // parameters for species 1 balls
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
  deathVisualGood_1: 10,
  deathVisualBad_1: 1,
  deathSoundGood_1: 0,
  deathSoundBad_1: 0,
  createSound_1: 1,
  deleteSound_1: 1,
  flySound_1: 1,
  successSound_1: 1,
  toolSound_1: 1,

  // parameters for species 2 balls
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

  // parameters for species 3 balls
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

  // parameters for species 4 balls
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
  deathSoundGood_4: 0,
  deathSoundBad_4: 0,
  createSound_4: 4,
  deleteSound_4: 4,
  flySound_4: 4,
  successSound_4: 4,
  toolSound_4: 4
};

export const MAX_BALLS_COUNT = 110;

export const LEVEL_BAR_PREVIEWS_BUTTON_CONFIG: any = {
  hoverFrame: Images.PrevHover.Name,
  upFrame: Images.PrevEnabled.Name,
  disableFrame: Images.PrevDisabled.Name
};

export const LEVEL_BAR_NEXT_BUTTON_CONFIG: any = {
  hoverFrame: Images.PrevHover.Name,
  upFrame: Images.PrevEnabled.Name,
  disableFrame: Images.PrevDisabled.Name,
  flip: true
};

export const LEVEL_BAR_RETRY_BUTTON_CONFIG: any = {
  hoverFrame: Images.ResetHover.Name,
  upFrame: Images.ResetEnabled.Name,
  disableFrame: Images.ResetDisabled.Name
};

export const TOOLS_BAR_FLING_TOOL_CONFIG: any = {
  active: Images.FlingToolSelected.Name,
  passive: Images.FlingTool.Name
};

export const TOOLS_BAR_DRAG_TOOL_CONFIG: any = {
  active: Images.MoveToolSelected.Name,
  passive: Images.MoveTool.Name
};

export const TOOLS_BAR_CREATE_TOOL_CONFIG: any = {
  active: Images.CreateToolSelected.Name,
  passive: Images.CreateTool.Name
};

export const TOOLS_BAR_DELETE_TOOL_CONFIG: any = {
  active: Images.DeleteToolSelected.Name,
  passive: Images.DeleteTool.Name
};

export const CREATE_TOOL_MAIN_BALL_OPTION_CONFIG: any = {
  scale: 0.23,
  frame: MAIN_BALL_DEFAULT_FRAME
};

export const ToolSound: any = {
  fling: "fizzics/flingTool",
  drag: "fizzics/moveTool",
  create: "fizzics/createTool",
  delete: "fizzics/trashTool"
};

export const CREATE_TOOL_STAR_BALL_OPTION_CONFIG: any = {
  scale: 0.25,
  frame: STAR_BALL_DEFAULT_FRAME
};

export const CREATE_TOOL_BOMB_BALL_OPTION_CONFIG: any = {
  scale: 0.22,
  frame: BOMB_BALL_DEFAULT_FRAME
};

export const CREATE_TOOL_ROCK_BALL_OPTION_CONFIG: any = {
  scale: 0.24,
  frame: ROCK_BALL_DEFAULT_FRAME
};

export const CREATE_TOOL_DIAMOND_BALL_OPTION_CONFIG: any = {
  scale: 0.24,
  frame: DIAMOND_BALL_DEFAULT_FRAME
};
