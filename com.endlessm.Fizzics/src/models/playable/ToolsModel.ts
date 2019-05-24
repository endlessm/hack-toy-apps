import { injectable } from "@robotlegsjs/core";
import { action, computed, observable } from "mobx";
import { BallTypes, IRawPreset, ToolType } from "../../constants/types";
import { CreateToolVO } from "./CreateToolVO";
import { ToolVO } from "./ToolVO";

@injectable()
export class ToolsModel {
  private _tools: Map<ToolType, ToolVO>;

  @observable
  private _activeToolType: ToolType;

  constructor(rawPreset: IRawPreset) {
    const {
      disableToolsOnlyInFurthestLevel,
      flingToolDisabled,
      moveToolDisabled,
      createToolDisabled,
      deleteToolDisabled
    } = rawPreset;

    const flingTool = new ToolVO(ToolType.FLING, !flingToolDisabled);
    const dragTool = new ToolVO(ToolType.DRAG, !moveToolDisabled);
    const createTool = new CreateToolVO(ToolType.CREATE, !createToolDisabled, BallTypes.MAIN);
    const deleteTool = new ToolVO(ToolType.DELETE, !deleteToolDisabled);

    this._tools = new Map([
      [flingTool.type, flingTool],
      [dragTool.type, dragTool],
      [createTool.type, createTool],
      [deleteTool.type, deleteTool]
    ]);

    this.addTool(ToolType.FLING);
    this.addTool(ToolType.DRAG);
    this.addTool(ToolType.CREATE);
    this.addTool(ToolType.DELETE);

    this.updateActiveTool(ToolType.FLING);
  }

  public get tools(): Map<ToolType, ToolVO> {
    return this._tools;
  }

  public getTool(value: ToolType): ToolVO {
    return this._tools.get(value);
  }

  public getCreateTool(): CreateToolVO {
    return this.getTool(ToolType.CREATE) as CreateToolVO;
  }

  @computed
  public get activeToolType(): ToolType {
    return this._activeToolType;
  }

  @action
  public addTool(value: ToolType): void {
    this._tools.get(value).inUse = true;
  }

  @action
  public removeTool(value: ToolType): void {
    this._tools.get(value).inUse = false;
  }

  @action
  public updateActiveTool(value: ToolType): void {
    this._activeToolType = value;
  }
}
