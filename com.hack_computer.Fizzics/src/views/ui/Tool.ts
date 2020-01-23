import { ToolType } from "../../constants/types";
import { NavItem } from "./NavItem";

export class Tool extends NavItem<ToolType> {
  public get activeFrame(): string {
    return `${this.t}_tool_selected`;
  }

  public get defaultFrame(): string {
    return `${this.t}_tool`;
  }

  public select(): void {
    this.bg.setFrame(this.activeFrame);
  }

  public deselect(): void {
    this.bg.setFrame(this.defaultFrame);
  }
}
