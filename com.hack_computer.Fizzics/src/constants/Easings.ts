class Ease {
  public readonly In: string;
  public readonly Out: string;
  public readonly InOut: string;

  constructor(prefix: string) {
    this.In = `${prefix}.easeIn`;
    this.Out = `${prefix}.easeOut`;
    this.InOut = `${prefix}.easeInOut`;
  }
}

export class Easings {
  public static readonly Linear: string = 'Linear';
  public static readonly Quad: Ease = new Ease('Qaud');
  public static readonly Cubic: Ease = new Ease('Cubic');
  public static readonly Quart: Ease = new Ease('Quart');
  public static readonly Quint: Ease = new Ease('Quint');
  public static readonly Sine: Ease = new Ease('Sine');
  public static readonly Expo: Ease = new Ease('Expo');
  public static readonly Circ: Ease = new Ease('Circ');
  public static readonly Back: Ease = new Ease('Back');
  public static readonly Bounce: Ease = new Ease('Bounce');
}
