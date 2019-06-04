import { Facade, Proxy } from "@koreez/mvcx";
import { ToolsEvents } from "../constants/EventNames";
import { ToolType } from "../constants/types";
import { CreateToolVOProxy } from "./CreateToolVOProxy";
import { ToolsVO } from "./ToolsVO";

export class ToolsVOProxy extends Proxy<ToolsVO> {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this.facade.registerProxy(CreateToolVOProxy);
  }

  public onRemove(): void {
    this.facade.removeProxy(CreateToolVOProxy);
    super.onRemove();
  }

  public initialize(): void {
    super.setVO(new ToolsVO());

    const createToolVOProxy = this.facade.retrieveProxy(CreateToolVOProxy);
    createToolVOProxy.initialize(this.vo.createTool);
  }

  public updateToolEnable(t: ToolType, value: boolean): void {
    this.vo.tools.get(t).enabled = value;
    this.facade.sendNotification(ToolsEvents.ToolEnableUpdate, t, value);
  }

  public updateToolInUse(t: ToolType, value: boolean): void {
    this.vo.tools.get(t).inUse = value;
    this.facade.sendNotification(ToolsEvents.ToolInUseUpdate, t, value);
  }

  public updateActiveTool(t: ToolType): void {
    this.vo.activeTool = t;
    this.facade.sendNotification(ToolsEvents.ActiveToolUpdate, t);
  }
}
