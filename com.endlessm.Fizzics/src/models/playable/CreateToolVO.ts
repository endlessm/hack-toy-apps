import { action, computed, observable } from 'mobx';
import { BallTypes, ToolType } from '../../constants/types';
import { ToolVO } from './ToolVO';

export class CreateToolVO extends ToolVO {
  @observable
  private _activeOption: BallTypes;

  constructor(type: ToolType, enabled: boolean, activeOption: BallTypes) {
    super(type, enabled);
    this._activeOption = activeOption;
  }

  @computed
  public get activeOption(): BallTypes {
    return this._activeOption;
  }

  public set activeOption(value: BallTypes) {
    this._activeOption = value;
  }

  @action
  public updateActiveOption(option: BallTypes): void {
    this._activeOption = option;
  }
}
