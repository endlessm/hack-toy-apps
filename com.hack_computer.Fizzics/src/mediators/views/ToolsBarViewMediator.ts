import { DynamicMediator, Facade } from "@koreez/mvcx";
import { ToolsEvents, UIEvents } from "../../constants/EventNames";
import { ToolType } from "../../constants/types";
import { ToolsBarView } from "../../views/ui/ToolsBarView";

export class ToolsBarViewMediator extends DynamicMediator<ToolsBarView> {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this.view.build();
    this.view.setPosition(60, 70);
    this.view.on("optionClick", this._onToolClick, this);

    this._subscribe(ToolsEvents.ActiveToolUpdate, this._onActiveToolUpdate);
    this._subscribe(ToolsEvents.ToolEnableUpdate, this._onToolEnableChange);
    this._subscribe(ToolsEvents.ToolInUseUpdate, this._onToolInUseChange);
  }

  private _onActiveToolUpdate(toolType: ToolType): void {
    this.view.setToolActive(toolType);
  }

  private _onToolEnableChange(toolType: ToolType, value: boolean): void {
    this.view.updateToolEnable(toolType, value);
  }

  private _onToolInUseChange(toolType: ToolType, value: boolean): void {
    this.view.updateToolInUse(toolType, value);
  }

  private _onToolClick(toolType: ToolType): void {
    this.facade.sendNotification(UIEvents.ToolSwitch, toolType);
  }
}
