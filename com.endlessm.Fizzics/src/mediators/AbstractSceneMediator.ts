import { injectable } from '@robotlegsjs/core';
import { SceneMediator } from '@robotlegsjs/phaser';
import { IReactionOptions, IReactionPublic } from 'mobx';
import { AbstractScene } from '../scenes/AbstractScene';
import { MediatorsUtil } from './MediatorsUtil';

@injectable()
export abstract class AbstractSceneMediator<
  T extends AbstractScene
> extends SceneMediator<T> {
  protected _baseMediatorsUtil: MediatorsUtil;

  public initialize(): void {
    this._baseMediatorsUtil = new MediatorsUtil(this);
    this.scene.onCreationCompleteCb = this.sceneCreated.bind(this);
  }

  public destroy(): void {
    this._baseMediatorsUtil.destroy();
    this._baseMediatorsUtil = undefined;
  }

  protected addReaction<TD>(
    expression: (r: IReactionPublic) => TD,
    effect: (arg: TD, r: IReactionPublic) => void,
    opts?: IReactionOptions,
  ): this {
    this._baseMediatorsUtil.addReaction(expression, effect, opts);

    return this;
  }

  protected removeReaction<TD>(
    effect: (arg: TD, r: IReactionPublic) => void,
  ): this {
    this._baseMediatorsUtil.removeReaction(effect);

    return this;
  }

  protected sceneCreated(): void {
    // ...
  }
}
