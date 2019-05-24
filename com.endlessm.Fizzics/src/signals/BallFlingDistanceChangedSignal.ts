import { AbstractSignal } from "./AbstractSignal";

export class BallFlingDistanceChangedSignal extends AbstractSignal {
  constructor() {
    super(Number);
  }
}
