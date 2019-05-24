import { inject, injectable } from "@robotlegsjs/core";
import { ACTIVE_LEVEL } from "../../../constants/constants";
import { BallModel } from "../../../models/balls/BallModel";
import { LevelModel } from "../../../models/playable/LevelModel";
import { BallFlingDisabledSignal } from "../../../signals/BallFlingDisabledSignal";
import { BallFlingEnabledSignal } from "../../../signals/BallFlingEnabledSignal";
import { BallView } from "../../../views/balls/BallView";
import { AbstractViewMediator } from "../../AbstractViewMediator";

@injectable()
export class BallViewMediator extends AbstractViewMediator<BallView> {
  @inject(ACTIVE_LEVEL)
  private readonly _activeLevel: LevelModel;

  @inject(BallFlingEnabledSignal)
  private readonly _ballFlingEnabledSignal: BallFlingEnabledSignal;

  @inject(BallFlingDisabledSignal)
  private readonly _ballFlingDisabledSignal: BallFlingDisabledSignal;

  private _model: BallModel;

  public initialize(): void {
    super.initialize();
    this._model = this._activeLevel.balls.get(this.view.id);

    this._setStartPosition(this._model.x, this._model.y);

    this.addReaction(() => this._model.frameIndex, this._updateTexture, {
      fireImmediately: true
    });
    this.addReaction(() => this._model.radius, this._updateRadius, {
      fireImmediately: true
    });
    this.addReaction(() => this._model.frozen, this._updateFrozen, {
      fireImmediately: true
    });
    this.addReaction(() => this._model.bounce, this._updateBounce, {
      fireImmediately: true
    });
    this.addReaction(() => this._model.friction, this._updateFriction, {
      fireImmediately: true
    });
    this.addReaction(() => this._model.gravityScale, this._updateGravityScale, {
      fireImmediately: true
    });
    this.addReaction(() => this._model.collisionGroup, this._updateCollisionGroup, { fireImmediately: true });
    this.addReaction(() => this._model.draggable, this._updateDrag);
    this.addReaction(() => this._model.flingable, this._updateFling);
  }

  private _updateTexture(imageIndex: string): void {
    this.view.updateTexture(imageIndex);
  }

  private _updateRadius(radius: number): void {
    this.view.updateRadius(radius);
  }

  private _updateFrozen(frozen: boolean): void {
    this.view.updateFrozen(frozen);
  }

  private _updateBounce(bounce: number): void {
    this.view.updateBounce(bounce);
  }

  private _updateGravityScale(gravityScale: number): void {
    this.view.updateGravityScale(gravityScale);
  }

  private _updateFriction(friction: number): void {
    this.view.updateFriction(friction);
  }

  private _updateCollisionGroup(collisionGroup: number): void {
    this.view.updateCollisionGroup(collisionGroup);
  }

  private _updateDrag(draggable: boolean): void {
    this._updateFrozen(!draggable);
  }

  private _updateFling(flingable: boolean): void {
    if (flingable) {
      this._updateFrozen(true);
      this._ballFlingEnabledSignal.dispatch(this.view);
    } else {
      this._updateFrozen(this._model.frozen);
      this._ballFlingDisabledSignal.dispatch(this.view);
    }
  }

  private _setStartPosition(x: number, y: number): void {
    this.view.setStartPosition(x, y);
  }
}
