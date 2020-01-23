import { BallType, INavigationConfig } from "../../constants/types";
import { DynamicNavigation } from "../dynamics/DynamicNavigation";
import { CreateToolOption } from "./CreateToolOption";

export class CreateToolBarView extends DynamicNavigation<BallType> {
  constructor(scene: Phaser.Scene) {
    super(scene, `CreateToolBarViewMediator`);
  }

  public build(): void {
    const config: INavigationConfig = {
      padding: { x: 18, y: 20 },
      gap: 50,
      scale: 0.22,
      items: [
        new CreateToolOption(this.scene, BallType.MAIN),
        new CreateToolOption(this.scene, BallType.STAR),
        new CreateToolOption(this.scene, BallType.BOMB),
        new CreateToolOption(this.scene, BallType.ROCK),
        new CreateToolOption(this.scene, BallType.DIAMOND)
      ]
    };
    super.build(config);

    this.bg.setInteractive();
  }

  public updateOptionFrame(ballType: BallType, frameIndex: number): void {
    //@ts-ignore
    this.tools.get(ballType).updateBgFrame(frameIndex);
  }

  public switchVisible(): void {
    this.visible = !this.visible;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}
