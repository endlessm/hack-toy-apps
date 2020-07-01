import { Proxy } from '@koreez/mvcx';
import { IRawLevel } from '../constants/types';
import { RawLevelsVO } from './RawLevelsVO';

export class RawLevelsVOProxy extends Proxy<RawLevelsVO> {
  constructor() {
    super(new RawLevelsVO());
  }

  public initialize(levels: IRawLevel[]): void {
    this.vo.levels = levels;
  }

  public getLevel(levelIndex: number): IRawLevel {
    return this.vo.levels[levelIndex];
  }
}
