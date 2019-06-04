
declare const __ENV__: string;
declare var globalParameters: {
  //min and max values for ball parameters
  minRadius: number;
  maxRadius: number;
  minGravity: number;
  maxGravity: number;
  minCollision: number;
  maxCollision: number;
  minFriction: number;
  maxFriction: number;
  minSocialForce: number;
  maxSocialForce: number;

  // index of background image
  backgroundImageIndex: number;

  // switches for including game tools
  moveToolActive: boolean;
  flingToolActive: boolean;
  createToolActive: boolean;
  deleteToolActive: boolean;

  // Flags to force disabling a tool. Do not expose in the toolbox!
  flingToolDisabled: boolean;
  moveToolDisabled: boolean;
  createToolDisabled: boolean;
  deleteToolDisabled: boolean;
  createType0Disabled: boolean;
  createType1Disabled: boolean;
  createType2Disabled: boolean;
  createType3Disabled: boolean;
  createType4Disabled: boolean;

  // Communication with Clubhouse
  preset: number;
  quest0Success: boolean;
  quest1Success: boolean;
  quest2Success: boolean;
  quest3Success: boolean;
  quest4Success: boolean;
  type0BallCount: number;
  type1BallCount: number;
  type2BallCount: number;
  type4BallCount: number;
  flingCount: number;
  score: number;
  currentLevel: number;
  flipped: boolean;
  levelSuccess: boolean;
  levelLoading: boolean;
  ballDied: boolean;

  // parameters for species number balls
  radius_0: number;
  gravity_0: number;
  collision_0: number;
  friction_0: number;
  usePhysics_0: boolean;
  socialForce_0_0: number;
  socialForce_0_1: number;
  socialForce_0_2: number;
  socialForce_0_3: number;
  socialForce_0_4: number;
  touchDeath_0_0: number;
  touchDeath_0_1: number;
  touchDeath_0_2: number;
  touchDeath_0_3: number;
  touchDeath_0_4: number;
  deathVisualGood_0: number;
  deathVisualBad_0: number;
  deathSoundGood_0: number;
  deathSoundBad_0: number;
  imageIndex_0: number;

  // parameters for species 1 balls
  radius_1: number;
  gravity_1: number;
  collision_1: number;
  friction_1: number;
  usePhysics_1: boolean;
  socialForce_1_0: number;
  socialForce_1_1: number;
  socialForce_1_2: number;
  socialForce_1_3: number;
  socialForce_1_4: number;
  touchDeath_1_0: number;
  touchDeath_1_1: number;
  touchDeath_1_2: number;
  touchDeath_1_3: number;
  touchDeath_1_4: number;
  deathVisualGood_1: number;
  deathVisualBad_1: number;
  deathSoundGood_1: number;
  deathSoundBad_1: number;
  imageIndex_1: number;

  //------------------------------------
  // parameters for species 2 balls
  //------------------------------------
  radius_2: number;
  gravity_2: number;
  collision_2: number;
  friction_2: number;
  usePhysics_2: boolean;
  socialForce_2_0: number;
  socialForce_2_1: number;
  socialForce_2_2: number;
  socialForce_2_3: number;
  socialForce_2_4: number;
  touchDeath_2_0: number;
  touchDeath_2_1: number;
  touchDeath_2_2: number;
  touchDeath_2_3: number;
  touchDeath_2_4: number;
  deathVisualGood_2: number;
  deathVisualBad_2: number;
  deathSoundGood_2: number;
  deathSoundBad_2: number;
  imageIndex_2: number;

  //------------------------------------
  // parameters for species 3 balls
  //------------------------------------
  radius_3: number;
  gravity_3: number;
  collision_3: number;
  friction_3: number;
  usePhysics_3: boolean;
  socialForce_3_0: number;
  socialForce_3_1: number;
  socialForce_3_2: number;
  socialForce_3_3: number;
  socialForce_3_4: number;
  touchDeath_3_0: number;
  touchDeath_3_1: number;
  touchDeath_3_2: number;
  touchDeath_3_3: number;
  touchDeath_3_4: number;
  deathVisualGood_3: number;
  deathVisualBad_3: number;
  deathSoundGood_3: number;
  deathSoundBad_3: number;
  imageIndex_3: number;

  //------------------------------------
  // parameters for species 4 balls
  //------------------------------------
  radius_4: number;
  gravity_4: number;
  collision_4: number;
  friction_4: number;
  usePhysics_4: boolean;
  socialForce_4_0: number;
  socialForce_4_1: number;
  socialForce_4_2: number;
  socialForce_4_3: number;
  socialForce_4_4: number;
  touchDeath_4_0: number;
  touchDeath_4_1: number;
  touchDeath_4_2: number;
  touchDeath_4_3: number;
  touchDeath_4_4: number;
  deathVisualGood_4: number;
  deathVisualBad_4: number;
  deathSoundGood_4: number;
  deathSoundBad_4: number;
  imageIndex_4: number;
} & { playing?: boolean; paused?: boolean };

declare var ToyApp: {
  saveState(state: any): void;
  loadNotify(): void;
  requestState(): void;
};
declare var Sounds: { play(key: string): void; playLoop(key: string): void };
declare var fizzicsGame: Phaser.Game;


interface Window {
  flip(): void;
  reset(): void;
  saveState(state: any): void;
  loadState(state: any): void;
  globalParameters: {
    //min and max values for ball parameters
    minRadius: number;
    maxRadius: number;
    minGravity: number;
    maxGravity: number;
    minCollision: number;
    maxCollision: number;
    minFriction: number;
    maxFriction: number;
    minSocialForce: number;
    maxSocialForce: number;

    // index of background image
    backgroundImageIndex: number;

    // switches for including game tools
    moveToolActive: boolean;
    flingToolActive: boolean;
    createToolActive: boolean;
    deleteToolActive: boolean;

    // Flags to force disabling a tool. Do not expose in the toolbox!
    flingToolDisabled: boolean;
    moveToolDisabled: boolean;
    createToolDisabled: boolean;
    deleteToolDisabled: boolean;
    createType0Disabled: boolean;
    createType1Disabled: boolean;
    createType2Disabled: boolean;
    createType3Disabled: boolean;
    createType4Disabled: boolean;

    // Communication with Clubhouse
    preset: number;
    quest0Success: boolean;
    quest1Success: boolean;
    quest2Success: boolean;
    quest3Success: boolean;
    quest4Success: boolean;
    type0BallCount: number;
    type1BallCount: number;
    type2BallCount: number;
    type4BallCount: number;
    flingCount: number;
    score: number;
    currentLevel: number;
    flipped: boolean;
    levelSuccess: boolean;
    levelLoading: boolean;
    ballDied: boolean;

    // parameters for species number balls
    radius_0: number;
    gravity_0: number;
    collision_0: number;
    friction_0: number;
    usePhysics_0: boolean;
    socialForce_0_0: number;
    socialForce_0_1: number;
    socialForce_0_2: number;
    socialForce_0_3: number;
    socialForce_0_4: number;
    touchDeath_0_0: number;
    touchDeath_0_1: number;
    touchDeath_0_2: number;
    touchDeath_0_3: number;
    touchDeath_0_4: number;
    deathVisualGood_0: number;
    deathVisualBad_0: number;
    deathSoundGood_0: number;
    deathSoundBad_0: number;
    imageIndex_0: number;

    // parameters for species 1 balls
    radius_1: number;
    gravity_1: number;
    collision_1: number;
    friction_1: number;
    usePhysics_1: boolean;
    socialForce_1_0: number;
    socialForce_1_1: number;
    socialForce_1_2: number;
    socialForce_1_3: number;
    socialForce_1_4: number;
    touchDeath_1_0: number;
    touchDeath_1_1: number;
    touchDeath_1_2: number;
    touchDeath_1_3: number;
    touchDeath_1_4: number;
    deathVisualGood_1: number;
    deathVisualBad_1: number;
    deathSoundGood_1: number;
    deathSoundBad_1: number;
    imageIndex_1: number;

    //------------------------------------
    // parameters for species 2 balls
    //------------------------------------
    radius_2: number;
    gravity_2: number;
    collision_2: number;
    friction_2: number;
    usePhysics_2: boolean;
    socialForce_2_0: number;
    socialForce_2_1: number;
    socialForce_2_2: number;
    socialForce_2_3: number;
    socialForce_2_4: number;
    touchDeath_2_0: number;
    touchDeath_2_1: number;
    touchDeath_2_2: number;
    touchDeath_2_3: number;
    touchDeath_2_4: number;
    deathVisualGood_2: number;
    deathVisualBad_2: number;
    deathSoundGood_2: number;
    deathSoundBad_2: number;
    imageIndex_2: number;

    //------------------------------------
    // parameters for species 3 balls
    //------------------------------------
    radius_3: number;
    gravity_3: number;
    collision_3: number;
    friction_3: number;
    usePhysics_3: boolean;
    socialForce_3_0: number;
    socialForce_3_1: number;
    socialForce_3_2: number;
    socialForce_3_3: number;
    socialForce_3_4: number;
    touchDeath_3_0: number;
    touchDeath_3_1: number;
    touchDeath_3_2: number;
    touchDeath_3_3: number;
    touchDeath_3_4: number;
    deathVisualGood_3: number;
    deathVisualBad_3: number;
    deathSoundGood_3: number;
    deathSoundBad_3: number;
    imageIndex_3: number;

    //------------------------------------
    // parameters for species 4 balls
    //------------------------------------
    radius_4: number;
    gravity_4: number;
    collision_4: number;
    friction_4: number;
    usePhysics_4: boolean;
    socialForce_4_0: number;
    socialForce_4_1: number;
    socialForce_4_2: number;
    socialForce_4_3: number;
    socialForce_4_4: number;
    touchDeath_4_0: number;
    touchDeath_4_1: number;
    touchDeath_4_2: number;
    touchDeath_4_3: number;
    touchDeath_4_4: number;
    deathVisualGood_4: number;
    deathVisualBad_4: number;
    deathSoundGood_4: number;
    deathSoundBad_4: number;
    imageIndex_4: number;
  } & { playing?: boolean; paused?: boolean } & {
    _proxy?: { [index: string]: string | number | boolean };
  };
  ToyApp: any;
  Sounds: any;
  fizzicsGame: Phaser.Game;
}
