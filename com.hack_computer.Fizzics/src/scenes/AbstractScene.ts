import {
  INinePatchCreator,
  INinePatchFactory
} from "@koreez/phaser3-ninepatch";

export abstract class AbstractScene extends Phaser.Scene {
  public add: INinePatchFactory;
  public make: INinePatchCreator;

  private static readonly _consoleArgs: string[] = [
    "",
    `background: ${"#295A34"}`,
    `background: ${"#2FAA4A"}`,
    `color: ${"#102415"}; background: ${"#27D04C"};`,
    `background: ${"#2FAA4A"}`,
    `background: ${"#295A34"}`
  ];

  public init(): void {
    this.events.emit("init");
  }

  public create(): void {
    this.events.emit("create");
  }

  public logInit(): void {
    AbstractScene._consoleArgs[0] = `%c %c %c ${
      this.sys.settings.key
    }: init %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractScene._consoleArgs);
  }

  public logReady(): void {
    AbstractScene._consoleArgs[0] = `%c %c %c ${
      this.sys.settings.key
    }: create %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractScene._consoleArgs);
  }

  public logSleep(): void {
    AbstractScene._consoleArgs[0] = `%c %c %c ${
      this.sys.settings.key
    }: sleep %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractScene._consoleArgs);
  }

  public logWake(): void {
    AbstractScene._consoleArgs[0] = `%c %c %c ${
      this.sys.settings.key
    }: wake %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractScene._consoleArgs);
  }

  public logRemove(): void {
    AbstractScene._consoleArgs[0] = `%c %c %c ${
      this.sys.settings.key
    }: destroy %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractScene._consoleArgs);
  }
}
