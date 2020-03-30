import { Proxy } from "@koreez/mvcx";
import { BallTypeEvents } from "../constants/EventNames";
import { BallType } from "../constants/types";
import { getEnumValues } from "../utils/utils";
import { BallTypeVO } from "./BallTypeVO";

export class BallTypesVOProxy extends Proxy<Map<BallType, BallTypeVO>> {
  public initialize(): void {
    super.setVO(new Map());

    this._initializeBallTypes();
  }

  public getTypeConfig(ballType: BallType): BallTypeVO {
    return this.vo.get(ballType);
  }

  public updateRadius(ballType: BallType, value: number): void {
    this.vo.get(ballType).radius = value;
    this.facade.sendNotification(BallTypeEvents.Radius, ballType, value);
  }

  public updateGravity(ballType: BallType, value: number): void {
    this.vo.get(ballType).gravity = value;
    this.facade.sendNotification(BallTypeEvents.Gravity, ballType, value);
  }

  public updateCollision(ballType: BallType, value: number): void {
    this.vo.get(ballType).bounce = value;
    this.facade.sendNotification(BallTypeEvents.Bounce, ballType, value);
  }

  public updateFriction(ballType: BallType, value: number): void {
    this.vo.get(ballType).friction = value;
    this.facade.sendNotification(BallTypeEvents.Friction, ballType, value);
  }

  public usePhysics(ballType: BallType, value: boolean): void {
    this.vo.get(ballType).frozen = !value;
    this.facade.sendNotification(BallTypeEvents.Frozen, ballType, !value);
  }

  public updateDeathVisualGood(ballType: BallType, value: number): void {
    this.vo.get(ballType).visualGood = value;
    this.facade.sendNotification(BallTypeEvents.VisualGood, ballType, value);
  }

  public updateDeathVisualBad(ballType: BallType, value: number): void {
    this.vo.get(ballType).visualBad = value;
    this.facade.sendNotification(BallTypeEvents.VisualBad, ballType, value);
  }

  public updateDeathSoundGood(ballType: BallType, value: number): void {
    this.vo.get(ballType).soundGood = value;
    this.facade.sendNotification(BallTypeEvents.SoundGood, ballType, value);
  }

  public updateDeathSoundBad(ballType: BallType, value: number): void {
    this.vo.get(ballType).soundBad = value;
    this.facade.sendNotification(BallTypeEvents.SoundGood, ballType, value);
  }

  public updateImageIndex(ballType: BallType, value: number): void {
    this.vo.get(ballType).frameIndex = value;
    this.facade.sendNotification(BallTypeEvents.FrameIndex, ballType, value);
  }

  public updateSocialForce(ballTypeA: BallType, ballTypeB: BallType, value: number): void {
    //@ts-ignore
    this.vo.get(ballTypeA)[`socialForce_${ballTypeB}`] = value;
    this.facade.sendNotification(BallTypeEvents.SocialForce, ballTypeA, ballTypeB, value);
  }

  private _initializeBallTypes(): void {
    getEnumValues(BallType).forEach((ballType: BallType) => this.vo.set(ballType, new BallTypeVO(ballType)));
  }
}
