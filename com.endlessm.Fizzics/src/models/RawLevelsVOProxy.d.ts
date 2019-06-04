import { Proxy } from '@koreez/mvcx';
import { IRawLevel } from '../constants/types';
import { RawLevelsVO } from './RawLevelsVO';
export declare class RawLevelsVOProxy extends Proxy<RawLevelsVO> {
    constructor();
    initialize(levels: IRawLevel[]): void;
    getLevel(levelIndex: number): IRawLevel;
}
