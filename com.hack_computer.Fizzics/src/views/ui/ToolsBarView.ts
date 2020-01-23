import { INavigationConfig, ToolType } from "../../constants/types";
import { DynamicNavigation } from "../dynamics/DynamicNavigation";
import { CreateToolView } from "./CreateToolView";
import { Tool } from "./Tool";

export class ToolsBarView extends DynamicNavigation<ToolType> {
  constructor(scene: Phaser.Scene) {
    super(scene, `ToolsBarViewMediator`);
  }

  public build(): void {
    const config: INavigationConfig = {
      padding: { x: 22, y: 26 },
      gap: 58,
      items: [
        new Tool(this.scene, ToolType.FLING),
        new Tool(this.scene, ToolType.MOVE),
        new CreateToolView(this.scene),
        new Tool(this.scene, ToolType.REMOVE)
      ]
    };
    super.build(config);
  }
}
