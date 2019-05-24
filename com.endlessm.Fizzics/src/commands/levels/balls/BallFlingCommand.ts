import { inject } from '@robotlegsjs/core';
import { SequenceMacro } from '@robotlegsjs/macrobot';
import { UpdateFlingsCommand } from '../UpdateFlingsCommand';
import { DisableBallsFlingCommand } from './DisableBallsFlingCommand';

export class BallFlingCommand extends SequenceMacro {
  @inject(Number)
  private _id: number;

  public prepare(): void {
    this.add(UpdateFlingsCommand);
  }
}
