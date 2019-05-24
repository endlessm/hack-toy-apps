import { inject } from '@robotlegsjs/core';
import { SequenceMacro } from '@robotlegsjs/macrobot';
import { DragToolActiveGuard } from '../../guards/DragToolActiveGuard';
import { DisableBallDragCommand } from './DisableBallDragCommand';

export class BallPointerUpCommand extends SequenceMacro {
  @inject(Number)
  private _id: number;

  public prepare(): void {
    this.add(DisableBallDragCommand).withGuards(DragToolActiveGuard);
  }
}
