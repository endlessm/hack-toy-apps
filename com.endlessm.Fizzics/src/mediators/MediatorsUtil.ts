import { IReactionDisposer, IReactionOptions, IReactionPublic, IWhenOptions, reaction, when } from 'mobx';

export class MediatorsUtil {
  private static _disposeReaction<TD>(
    map: Map<(arg: TD, r: IReactionPublic) => void, IReactionDisposer>,
    effect: (arg: TD, r: IReactionPublic) => void,
  ): void {
    if (map.has(effect)) {
      const reactionDisposer: IReactionDisposer = map.get(effect);
      reactionDisposer();
      map.delete(effect);
    }
  }

  protected _reactionMap: Map<
    // tslint:disable-next-line:no-any
    (arg: any, r: IReactionPublic) => void,
    IReactionDisposer
  >;
  protected _whenMap: Map<
    // tslint:disable-next-line:no-any
    (arg: any, r: IReactionPublic) => void,
    IReactionDisposer
  >;

  constructor(context: object) {
    this._mediatorContext = context;
    this._reactionMap = new Map();
    this._whenMap = new Map();
    this.initialize();
  }
  private static readonly _consoleArgs: string[] = [
    '',
    `background: ${'#2A3351'}`,
    `background: ${'#364D98'}`,
    `color: ${'#F4F6FE'}; background: ${'#3656C1'};`,
    `background: ${'#364D98'}`,
    `background: ${'#2A3351'}`,
  ];

  private _mediatorContext: object;

  public initialize(): void {
    MediatorsUtil._consoleArgs[0] = `%c %c %c ${this._mediatorContext.constructor.name}: initialize %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, MediatorsUtil._consoleArgs);
  }

  public destroy(): void {
    this.removeAllReactions();
    this._reactionMap = undefined;
    MediatorsUtil._consoleArgs[0] = `%c %c %c ${this._mediatorContext.constructor.name}: destroy %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, MediatorsUtil._consoleArgs);
  }

  public addReaction<TD>(
    expression: (r: IReactionPublic) => TD,
    effect: (arg: TD, r: IReactionPublic) => void,
    opts?: IReactionOptions,
  ): this {
    this._reactionMap.set(effect, reaction(expression, effect.bind(this._mediatorContext), opts));

    return this;
  }

  public addReactionWhen<TD>(
    predicate: () => boolean,
    expression: (r: IReactionPublic) => TD,
    effect: (arg: TD, r: IReactionPublic) => void,
    reactionOptions?: IReactionOptions,
    whenOptions?: IWhenOptions,
  ): this {
    const whenDisposer: IReactionDisposer = when(
      predicate,
      () => {
        if (this._whenMap.has(effect)) {
          this._whenMap.delete(effect);
        }
        this._reactionMap.set(effect, reaction(expression, effect.bind(this._mediatorContext), reactionOptions));
      },
      whenOptions,
    );
    this._whenMap.set(effect, whenDisposer);

    return this;
  }

  public removeReaction<TD>(effect: (arg: TD, r: IReactionPublic) => void): this {
    MediatorsUtil._disposeReaction(this._reactionMap, effect);
    MediatorsUtil._disposeReaction(this._whenMap, effect);

    return this;
  }

  public removeAllReactions(): void {
    this._reactionMap.forEach((reactionDisposer: IReactionDisposer) => {
      reactionDisposer();
    });
    this._reactionMap.clear();
  }
}
