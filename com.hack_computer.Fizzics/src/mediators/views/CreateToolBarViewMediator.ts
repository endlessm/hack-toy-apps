import { DynamicMediator, Facade } from "@koreez/mvcx";
import { BallTypeEvents, GameEvents, ToolsEvents, UIEvents } from "../../constants/EventNames";
import { BallType } from "../../constants/types";
import { CreateToolBarView } from "../../views/ui/CreateToolBarView";

export class CreateToolBarViewMediator extends DynamicMediator<
  CreateToolBarView
> {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    this.view.build();
    this.view.setPosition(74, 0);
    this.view.on("optionClick", this._onOptionClick, this);

    this._subscribe(
      ToolsEvents.CreateToolActiveOptionUpdate,
      this._onActiveOptionUpdate
    );
    this._subscribe(GameEvents.PointerDown, this._onScenePointerDown);
    this._subscribe(
      ToolsEvents.CreateToolOptionEnableUpdate,
      this._onOptionEnableChange
    );

    this._subscribe(GameEvents.PointerDown, this._onScenePointerDown);
    this._subscribe(BallTypeEvents.FrameIndex, this._onTypeFrameIndex);
  }

  private _onOptionClick(optionType: BallType): void {
    this.facade.sendNotification(UIEvents.CreateToolOptionSwitch, optionType);
  }

  private _onActiveOptionUpdate(option: BallType): void {
    this.view.setToolActive(option);
  }

  private _onOptionEnableChange(toolType: BallType, value: boolean): void {
    this.view.updateToolEnable(toolType, value);
  }

  private _onScenePointerDown(): void {
    this.view.hide();
  }

  private _onTypeFrameIndex(ballType: BallType, frameIndex: number): void {
    this.view.updateOptionFrame(ballType, frameIndex);
  }
}
