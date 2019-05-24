import { injectable } from '@robotlegsjs/core';
import { ViewMediator } from '@robotlegsjs/phaser';
import { IReactionOptions, IReactionPublic, IWhenOptions } from 'mobx';
import { AbstractView } from '../views/AbstractView';
import { MediatorsUtil } from './MediatorsUtil';

@injectable()
export abstract class AbstractViewMediator<T extends AbstractView> extends ViewMediator<T> {
  protected _baseMediatorsUtil: MediatorsUtil;

  public initialize(): void {
    this._baseMediatorsUtil = new MediatorsUtil(this);
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
  public addReactionWhen<TD>(
    predicate: () => boolean,
    expression: (r: IReactionPublic) => TD,
    effect: (arg: TD, r: IReactionPublic) => void,
    reactionOptions?: IReactionOptions,
    whenOptions?: IWhenOptions,
  ): this {
    this._baseMediatorsUtil.addReactionWhen(predicate, expression, effect, reactionOptions, whenOptions);

    return this;
  }

  protected removeReaction<TD>(effect: (arg: TD, r: IReactionPublic) => void): this {
    this._baseMediatorsUtil.removeReaction(effect);

    return this;
  }

  protected removeAllReactions(): void {
    this._baseMediatorsUtil.removeAllReactions();
  }
}
