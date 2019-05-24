import { injectable } from '@robotlegsjs/core';
import { AsyncCommand } from '@robotlegsjs/macrobot';

@injectable()
export abstract class AbstractAsyncCommand extends AsyncCommand {
  private static readonly _consoleArgs: string[] = [
    '',
    `background: ${'#190226'}`,
    `background: ${'#49046F'}`,
    `color: ${'#FAF3FE'}; background: ${'#5C038D'};`,
    `background: ${'#49046F'}`,
    `background: ${'#190226'}`,
  ];

  public execute(): void {
    AbstractAsyncCommand._consoleArgs[0] = `%c %c %c ${
      this.constructor.name
    }: execute: start %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractAsyncCommand._consoleArgs);
  }

  protected dispatchComplete(success: boolean): void {
    AbstractAsyncCommand._consoleArgs[0] = `%c %c %c ${
      this.constructor.name
    }: execute: complete [${success}] %c %c `;
    // tslint:disable-next-line:no-console
    console.log.apply(console, AbstractAsyncCommand._consoleArgs);
    super.dispatchComplete(success);
  }
}
