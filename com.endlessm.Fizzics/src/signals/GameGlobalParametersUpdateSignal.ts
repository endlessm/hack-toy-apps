import { injectable } from "@robotlegsjs/core";
import { AbstractSignal } from "./AbstractSignal";

@injectable()
export class GameGlobalParametersUpdateSignal extends AbstractSignal {
  constructor() {
    super(Object);
  }
}
