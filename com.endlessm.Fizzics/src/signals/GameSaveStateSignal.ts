import { injectable } from "@robotlegsjs/core";
import { AbstractSignal } from "./AbstractSignal";

@injectable()
export class GameSaveStateSignal extends AbstractSignal {
  constructor() {
    super(Object);
  }
}
