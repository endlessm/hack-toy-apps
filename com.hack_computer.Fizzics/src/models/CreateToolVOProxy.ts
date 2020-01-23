import { Proxy } from "@koreez/mvcx";
import { ToolsEvents } from "../constants/EventNames";
import { BallType } from "../constants/types";
import { CreateToolVO } from "./CreateToolVO";

export class CreateToolVOProxy extends Proxy<CreateToolVO> {
  public initialize(vo: CreateToolVO): void {
    super.setVO(vo);

    this.updateCreateToolActiveOption(BallType.MAIN);
  }

  public updateCreateToolActiveOption(t: BallType): void {
    this.vo.activeOption = t;

    this.facade.sendNotification(
      ToolsEvents.CreateToolActiveOptionUpdate,
      this.vo.activeOption
    );
  }

  public updateToolEnable(t: BallType, value: boolean): void {
    this.vo.options.get(t).enabled = value;
    this.facade.sendNotification(
      ToolsEvents.CreateToolOptionEnableUpdate,
      t,
      value
    );
  }
}
