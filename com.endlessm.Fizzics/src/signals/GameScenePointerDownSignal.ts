import { injectable } from '@robotlegsjs/core';
import { AbstractSignal } from './AbstractSignal';

@injectable()
export class GameScenePointerDownSignal extends AbstractSignal {
  constructor() {
    super(Array);
  }
}
