import { injectable } from "@robotlegsjs/core";
import { AbstractSignal } from "./AbstractSignal";

@injectable()
export class BallMaxCountReachedSignal extends AbstractSignal {}
