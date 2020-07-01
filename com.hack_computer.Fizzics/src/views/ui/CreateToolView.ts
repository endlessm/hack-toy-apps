import { ToolType } from "../../constants/types";
import { CreateToolBarView } from "./CreateToolBarView";
import { Tool } from "./Tool";

export class CreateToolView extends Tool {
  constructor(scene: Phaser.Scene) {
    super(scene, ToolType.CREATE);

    this.add((this._menu = new CreateToolBarView(this.scene)));
  }

  private readonly _menu: CreateToolBarView;

  public select(): void {
    super.select();
    this._menu.switchVisible();
  }

  public deselect(): void {
    super.deselect();
    this._menu.hide();
  }
}
