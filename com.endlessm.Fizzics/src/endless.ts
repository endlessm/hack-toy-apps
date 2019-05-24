import { ZERO } from "./constants/constants";

/* exported globalParameters, levelParameters,

/*
 * Global parameters exposed to the quests and toolbox
 */

/* Global constants */

const globalParameters = {
  //min and max values for ball parameters
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

  // index of background image
  backgroundImageIndex: 0,

  // switches for including game tools
  moveToolActive: false,
  flingToolActive: false,
  createToolActive: false,
  deleteToolActive: false,

  // Flags to force disabling a tool. Do not expose in the toolbox!
  flingToolDisabled: false,
  moveToolDisabled: false,
  createToolDisabled: false,
  deleteToolDisabled: false,
  createType0Disabled: false,
  createType1Disabled: false,
  createType2Disabled: false,
  createType3Disabled: false,
  createType4Disabled: false,

  // Communication with Clubhouse
  preset: 0,
  quest0Success: false,
  quest1Success: false,
  quest2Success: false,
  quest3Success: false,
  quest4Success: false,
  type0BallCount: 0,
  type1BallCount: 0,
  type2BallCount: 0,
  type4BallCount: 0,
  flingCount: 0,
  score: 0,
  currentLevel: 0,
  flipped: false,
  levelSuccess: false,
  levelLoading: false,
  ballDied: false,

  // parameters for species 0 balls
  radius_0: ZERO,
  gravity_0: ZERO,
  collision_0: ZERO,
  friction_0: ZERO,
  usePhysics_0: false,
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
  deathVisualGood_0: 0,
  deathVisualBad_0: 0,
  deathSoundGood_0: 0,
  deathSoundBad_0: 0,
  imageIndex_0: 0,

  // parameters for species 1 balls
  radius_1: ZERO,
  gravity_1: ZERO,
  collision_1: ZERO,
  friction_1: ZERO,
  usePhysics_1: false,
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
  deathVisualGood_1: 0,
  deathVisualBad_1: 0,
  deathSoundGood_1: 0,
  deathSoundBad_1: 0,
  imageIndex_1: 0,

  //------------------------------------
  // parameters for species 2 balls
  //------------------------------------
  radius_2: ZERO,
  gravity_2: ZERO,
  collision_2: ZERO,
  friction_2: ZERO,
  usePhysics_2: false,
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
  deathVisualGood_2: 0,
  deathVisualBad_2: 0,
  deathSoundGood_2: 0,
  deathSoundBad_2: 0,
  imageIndex_2: 0,

  //------------------------------------
  // parameters for species 3 balls
  //------------------------------------
  radius_3: ZERO,
  gravity_3: ZERO,
  collision_3: ZERO,
  friction_3: ZERO,
  usePhysics_3: false,
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
  deathVisualGood_3: 0,
  deathVisualBad_3: 0,
  deathSoundGood_3: 0,
  deathSoundBad_3: 0,
  imageIndex_3: 0,

  //------------------------------------
  // parameters for species 4 balls
  //------------------------------------
  radius_4: ZERO,
  gravity_4: ZERO,
  collision_4: ZERO,
  friction_4: ZERO,
  usePhysics_4: false,
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
  deathVisualGood_4: 0,
  deathVisualBad_4: 0,
  deathSoundGood_4: 0,
  deathSoundBad_4: 0,
  imageIndex_4: 0
};

window.globalParameters = globalParameters;
