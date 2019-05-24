export abstract class AbstractView extends Phaser.GameObjects.Container {
  private static readonly _consoleArgs: string[] = [
    '',
    `background: ${'#295A34'}`,
    `background: ${'#2FAA4A'}`,
    `color: ${'#102415'}; background: ${'#27D04C'};`,
    `background: ${'#2FAA4A'}`,
    `background: ${'#295A34'}`,
  ];

  public destroy(): void {
    AbstractView._consoleArgs[0] = `%c %c %c ${this.constructor.name}: destroy %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractView._consoleArgs);
    super.destroy();
  }
}
