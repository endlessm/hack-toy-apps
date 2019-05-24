import { SequenceMacro } from "@robotlegsjs/macrobot";
import { LevelState } from "../../constants/types";
import { IsNotLastLevelGuard } from "../guards/IsNotLastLevelGuard";
import { LevelUnlockedGuard } from "../guards/LevelUnlockedGuard";
import { IncreaseLastUnlockedLevelCommand } from "../player/IncreaseLastUnlockedLevelCommand";
import { UpdateLevelScoreCommand } from "./UpdateLevelScoreCommand";
import { UpdateLevelStateCommand } from "./UpdateLevelStateCommand";

export class LevelCompleteCommand extends SequenceMacro {
  public prepare(): void {
    this.add(UpdateLevelScoreCommand);
    this.add(UpdateLevelStateCommand).withPayloads(LevelState.COMPLETE);
    this.add(IncreaseLastUnlockedLevelCommand).withGuards(LevelUnlockedGuard, IsNotLastLevelGuard);
  }
}
