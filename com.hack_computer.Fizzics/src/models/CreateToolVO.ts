import { BallType, ToolType } from "../constants/types";
import { CreateOptionVO } from "./CreateOptionVO";
import { ToolVO } from "./ToolVO";

export class CreateToolVO extends ToolVO {
  public options: Map<BallType, CreateOptionVO>;

  public activeOption: BallType;

  constructor() {
    super(ToolType.CREATE);

    const mainBallOption = new CreateOptionVO(BallType.MAIN);
    const starBallOption = new CreateOptionVO(BallType.STAR);
    const bombBallOption = new CreateOptionVO(BallType.BOMB);
    const rockBallOption = new CreateOptionVO(BallType.ROCK);
    const diamondBallOption = new CreateOptionVO(BallType.DIAMOND);

    this.options = new Map([
      [mainBallOption.t, mainBallOption],
      [starBallOption.t, starBallOption],
      [bombBallOption.t, bombBallOption],
      [rockBallOption.t, rockBallOption],
      [diamondBallOption.t, diamondBallOption]
    ]);
  }
}
