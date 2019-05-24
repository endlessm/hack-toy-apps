import { injectable } from '@robotlegsjs/core';
import { IDPair } from '../constants/types';
import { AbstractSignal } from './AbstractSignal';

@injectable()
export class CollisionMainStarSignal extends AbstractSignal {
  constructor() {
    super(IDPair);
  }
}
