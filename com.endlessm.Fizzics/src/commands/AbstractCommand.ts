import { injectable } from "@robotlegsjs/core";

@injectable()
export abstract class AbstractCommand {
  private static readonly _consoleArgs: string[] = [
    "",
    `background: ${"#3F234E"}`,
    `background: ${"#6E2994"}`,
    `color: ${"#D4BFE0"}; background: ${"#8724BD"};`,
    `background: ${"#6E2994"}`,
    `background: ${"#3F234E"}`
  ];

  public execute(): void {
    AbstractCommand._consoleArgs[0] = `%c %c %c ${this.constructor.name}: execute %c %c `;
    console.log.apply(console, AbstractCommand._consoleArgs);
  }
}
