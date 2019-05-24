import { SequenceMacro } from '@robotlegsjs/macrobot';
import { SavePlayerCommand } from './SavePlayerCommand';
import { SyncPlayerCommand } from './SyncPlayerCommand';

export class InitializePlayerModelCommand extends SequenceMacro {
  public prepare(): void {
    this.add(SyncPlayerCommand);
    this.add(SavePlayerCommand);
  }
}
