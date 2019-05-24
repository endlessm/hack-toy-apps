import { injectable } from "@robotlegsjs/core";
import { AbstractSignal } from "./AbstractSignal";

@injectable()
export class GameLoadStateSignal extends AbstractSignal {
  constructor() {
    super(Object);
  }
}
