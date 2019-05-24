export abstract class AbstractView extends Phaser.GameObjects.Container {
  private static readonly consoleArgs: string[] = [
    ``,
    `background: ${'#295A34'}`,
    `background: ${'#2FAA4A'}`,
    `color: ${'#102415'}; background: ${'#27D04C'};`,
    `background: ${'#2FAA4A'}`,
    `background: ${'#295A34'}`,
  ];
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public destroy(fromScene?: boolean): void {
    AbstractView.consoleArgs[0] = `%c %c %c ${this.constructor.name}: destroy %c %c `;
    console.log.apply(console, AbstractView.consoleArgs);
    super.destroy(fromScene);
  }
}
