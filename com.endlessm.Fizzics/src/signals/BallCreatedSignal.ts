import { AbstractSignal } from "./AbstractSignal";

export class BallCreatedSignal extends AbstractSignal {
  constructor() {
    super(Number);
  }
}
