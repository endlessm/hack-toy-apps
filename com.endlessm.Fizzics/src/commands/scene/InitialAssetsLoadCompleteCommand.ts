import { SequenceMacro } from "@robotlegsjs/macrobot";
import { StartGameCommand } from "../game/StartGameCommand";
import { InitializeRawLevelsModelCommand } from "../levels/InitializeRawLevelsModelCommand";
import { InitializeNinePatchCommand } from "./InitializeNinePatchCommand";
import { InitializePhysicsCommand } from "./InitializePhysicsCommand";
import { PrepareScenesCommand } from "./PrepareScenesCommand";

export class InitialAssetsLoadCompleteCommand extends SequenceMacro {
  public prepare(): void {
    if (window.ToyApp) {
      ToyApp.loadNotify();
    }
    this.add(InitializeRawLevelsModelCommand);
    this.add(InitializeNinePatchCommand);
    this.add(PrepareScenesCommand);
    this.add(InitializePhysicsCommand);
    this.add(StartGameCommand);
  }
}
