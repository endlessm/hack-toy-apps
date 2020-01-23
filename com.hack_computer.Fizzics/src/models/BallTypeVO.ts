import { BallType, IBallTypeConfig } from "../constants/types";

export class BallTypeVO implements IBallTypeConfig {
  public radius: number;

  public gravity: number;

  public friction: number;

  public frameIndex: number;

  public bounce: number;

  public visualGood: number;

  public visualBad: number;

  public soundGood: number;

  public soundBad: number;

  public frozen: boolean;

  public createSound: number;

  public deleteSound: number;

  public flySound: number;

  public successSound: number;

  public toolSound: number;

  public socialForce_0: number;

  public socialForce_1: number;

  public socialForce_2: number;

  public socialForce_3: number;

  public socialForce_4: number;

  public touchDeath_0: number;

  public touchDeath_1: number;

  public touchDeath_2: number;

  public touchDeath_3: number;

  public touchDeath_4: number;

  constructor(ballType: BallType) {
    const gp = window.globalParameters;

    //@ts-ignore
    this.radius = gp[`radius_${ballType}`];
    //@ts-ignore
    this.gravity = gp[`gravity_${ballType}`];
    //@ts-ignore
    this.friction = gp[`friction_${ballType}`];
    //@ts-ignore
    this.frameIndex = gp[`imageIndex_${ballType}`];
    //@ts-ignore
    this.bounce = gp[`collision_${ballType}`];
    //@ts-ignore
    this.visualGood = gp[`deathVisualGood_${ballType}`];
    //@ts-ignore
    this.visualBad = gp[`deathVisualBad_${ballType}`];
    //@ts-ignore
    this.soundGood = gp[`deathSoundGood_${ballType}`];
    //@ts-ignore
    this.soundBad = gp[`deathSoundBad_${ballType}`];
    //@ts-ignore
    this.frozen = !gp[`usePhysics_${ballType}`];
    //@ts-ignore
    this.createSound = gp[`createSound_${ballType}`];
    //@ts-ignore
    this.deleteSound = gp[`deleteSound_${ballType}`];
    //@ts-ignore
    this.flySound = gp[`flySound_${ballType}`];
    //@ts-ignore
    this.successSound = gp[`successSound_${ballType}`];
    //@ts-ignore
    this.toolSound = gp[`toolSound_${ballType}`];
    //@ts-ignore
    this.socialForce_0 = gp[`socialForce_${ballType}_0`];
    //@ts-ignore
    this.socialForce_1 = gp[`socialForce_${ballType}_1`];
    //@ts-ignore
    this.socialForce_2 = gp[`socialForce_${ballType}_2`];
    //@ts-ignore
    this.socialForce_3 = gp[`socialForce_${ballType}_3`];
    //@ts-ignore
    this.socialForce_4 = gp[`socialForce_${ballType}_4`];
    //@ts-ignore
    this.touchDeath_0 = gp[`touchDeath_${ballType}_0`];
    //@ts-ignore
    this.touchDeath_1 = gp[`touchDeath_${ballType}_1`];
    //@ts-ignore
    this.touchDeath_2 = gp[`touchDeath_${ballType}_2`];
    //@ts-ignore
    this.touchDeath_3 = gp[`touchDeath_${ballType}_3`];
    //@ts-ignore
    this.touchDeath_4 = gp[`touchDeath_${ballType}_4`];
  }
}
