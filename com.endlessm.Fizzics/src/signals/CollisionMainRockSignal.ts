import { injectable } from "@robotlegsjs/core";
import { IDPair } from "../constants/types";
import { AbstractSignal } from "./AbstractSignal";

@injectable()
export class CollisionMainRockSignal extends AbstractSignal {
  constructor() {
    super(IDPair);
  }
}
