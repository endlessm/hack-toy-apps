import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { IDPair } from "../../../constants/types";
import { NoMainBallExistGuard } from "../../guards/NoMainBallExistGuard";
import { LevelFailCommand } from "../LevelFailCommand";
import { RemoveBallCommand } from "./RemoveBallCommand";

export class CollisionWithBombCommand extends SequenceMacro {
  @inject(IDPair)
  private _idPair: IDPair;

  public prepare(): void {
    this.add(RemoveBallCommand).withPayloads(this._idPair.id1);
    this.add(LevelFailCommand).withGuards(NoMainBallExistGuard);
  }

  public execute(): void {
    super.execute();
  }
}
