import { injectable } from "@robotlegsjs/core";
import { Signal } from "@robotlegsjs/signals";
import { getCircularReplacer } from "../utils/utils";

@injectable()
export abstract class AbstractSignal extends Signal {
  private static readonly _dispatchConsoleArgs: string[] = [
    "",
    `background: ${"#757130"}`,
    `background: ${"#DED434"}`,
    `color: ${"#2F2E15"}; background: ${"#FFF325"};`,
    `background: ${"#DED434"}`,
    `background: ${"#757130"}`
  ];

  // tslint:disable-next-line:no-any
  public dispatch(...valueObjects: any[]): void {
    let str: string = "";
    valueObjects.forEach((valueObject: object, index: number) => {
      str += `${this.valueClasses[index].name}:'${JSON.stringify(valueObject, getCircularReplacer())}'`;
      str += valueObjects.length - 1 === index ? "" : " | ";
    });
    AbstractSignal._dispatchConsoleArgs[0] = `%c %c %c ${this.constructor.name}: dispatch [ ${str} ] %c %c `;
    // tslint:disable-next-line:no-console
    // console.log.apply(console, AbstractSignal._dispatchConsoleArgs);
    super.dispatch(...valueObjects);
  }
}
