import { injectable } from "@robotlegsjs/core";
import { computed, observable } from "mobx";
import { ToolType } from "../../constants/types";

@injectable()
export class ToolVO {
  private _type: ToolType;

  @observable
  private _enabled: boolean;

  @observable
  private _inUse: boolean;

  constructor(type: ToolType, enabled: boolean) {
    this._type = type;
    this._enabled = enabled;
  }

  public get type(): ToolType {
    return this._type;
  }

  @computed
  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
  }

  @computed
  public get inUse(): boolean {
    return this._inUse;
  }

  public set inUse(value: boolean) {
    this._inUse = value;
  }
}
