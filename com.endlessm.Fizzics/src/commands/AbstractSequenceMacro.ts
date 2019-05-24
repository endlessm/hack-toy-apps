import { injectable } from '@robotlegsjs/core';
import { SequenceMacro } from '@robotlegsjs/macrobot';

@injectable()
export abstract class AbstractSequenceMacro extends SequenceMacro {
  private static readonly _consoleArgs: string[] = [
    '',
    `background: ${'#2A0020'}`,
    `background: ${'#7A005C'}`,
    `color: ${'#FEF2FB'}; background: ${'#9C0075'};`,
    `background: ${'#7A005C'}`,
    `background: ${'#2A0020'}`,
  ];

  public execute(payload?: any, ...payloads: any[]): void {
    AbstractSequenceMacro._consoleArgs[0] = `%c %c %c ${this.constructor.name}: execute %c %c `;
    console.log.apply(console, AbstractSequenceMacro._consoleArgs);
    super.execute(payload, ...payloads);
  }

  protected dispatchComplete(success: boolean): void {
    AbstractSequenceMacro._consoleArgs[0] = `%c %c %c ${
      this.constructor.name
    }: execute: complete [${success}] %c %c `;
    console.log.apply(console, AbstractSequenceMacro._consoleArgs);
    super.dispatchComplete(success);
  }
}
