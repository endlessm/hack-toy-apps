import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { IDPair } from "../../../constants/types";
import { NoMainBallExistGuard } from "../../guards/NoMainBallExistGuard";
import { LevelCompleteCommand } from "../LevelCompleteCommand";
import { RemoveBallCommand } from "./RemoveBallCommand";

export class CollisionWithStarCommand extends SequenceMacro {
  @inject(IDPair)
  private _idPair: IDPair;

  public prepare(): void {
    this.add(RemoveBallCommand).withPayloads(this._idPair.id1);
    this.add(LevelCompleteCommand).withGuards(NoMainBallExistGuard);
  }

  public execute(): void {
    super.execute();
  }
}
