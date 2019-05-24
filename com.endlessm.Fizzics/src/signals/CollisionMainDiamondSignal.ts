import { injectable } from '@robotlegsjs/core';
import { IDPair } from '../constants/types';
import { AbstractSignal } from './AbstractSignal';

@injectable()
export class CollisionMainDiamondSignal extends AbstractSignal {
  constructor() {
    super(IDPair);
  }
}
