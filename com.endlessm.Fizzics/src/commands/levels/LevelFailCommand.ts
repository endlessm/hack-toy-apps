import { SequenceMacro } from '@robotlegsjs/macrobot';
import { LevelState } from '../../constants/types';
import { UpdateLevelStateCommand } from './UpdateLevelStateCommand';

export class LevelFailCommand extends SequenceMacro {
  public prepare(): void {
    this.add(UpdateLevelStateCommand).withPayloads(LevelState.FAIL);
  }
}
