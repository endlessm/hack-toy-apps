import { inject } from '@robotlegsjs/core';
import { SequenceMacro } from '@robotlegsjs/macrobot';
import { DisableBallsFlingCommand } from './DisableBallsFlingCommand';

export class BallFlingDistanceReachedCommand extends SequenceMacro {
  @inject(Number)
  private _id: number;

  public prepare(): void {
    this.add(DisableBallsFlingCommand);
  }
}
