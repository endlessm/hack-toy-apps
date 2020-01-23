export class DynamicContainer extends Phaser.GameObjects.Container {
  public get uuid(): string {
    return this._uuid;
  }

  constructor(scene: Phaser.Scene, uuid: string) {
    super(scene);
    this._uuid = uuid;
    this.construct();
  }

  private static readonly _consoleArgs: string[] = [
    "",
    `background: ${"#295A34"}`,
    `background: ${"#2FAA4A"}`,
    `color: ${"#102415"}; background: ${"#27D04C"};`,
    `background: ${"#2FAA4A"}`,
    `background: ${"#295A34"}`
  ];

  private readonly _uuid: string;

  public destroy(): void {
    DynamicContainer._consoleArgs[0] = `%c %c %c ${
      this.constructor.name
    }: destroy %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, DynamicContainer._consoleArgs);
    this.destruct();
    super.destroy();
  }

  // eslint-disable-next-line class-methods-use-this
  public construct(): void {
    // ...
  }

  // eslint-disable-next-line class-methods-use-this
  public destruct(): void {
    // ...
  }
}
