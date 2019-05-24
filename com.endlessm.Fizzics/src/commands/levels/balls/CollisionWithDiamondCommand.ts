import { inject } from "@robotlegsjs/core";
import { SequenceMacro } from "@robotlegsjs/macrobot";
import { IDPair } from "../../../constants/types";
import { UpdateDiamondsCommand } from "../UpdateDiamondsCommand";
import { RemoveBallCommand } from "./RemoveBallCommand";

export class CollisionWithDiamondCommand extends SequenceMacro {
  @inject(IDPair)
  private _idPair: IDPair;

  public prepare(): void {
    this.add(RemoveBallCommand).withPayloads(this._idPair.id2);
    this.add(UpdateDiamondsCommand);
  }

  public execute(): void {
    super.execute();
  }
}
