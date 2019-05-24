import { injectable } from '@robotlegsjs/core';
import { AbstractSignal } from './AbstractSignal';

@injectable()
export class GameScenePointerUpSignal extends AbstractSignal {
  constructor() {
    super(Array);
  }
}
