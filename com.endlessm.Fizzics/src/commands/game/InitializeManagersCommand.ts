import { inject } from "@robotlegsjs/core";
import { AudioManager } from "../../managers/AudioManager";
import { EffectsManager } from "../../managers/EffectsManager";
import { IntersectionManager } from "../../managers/IntersectionManager";
import { AbstractCommand } from "../AbstractCommand";

export class InitializeManagersCommand extends AbstractCommand {
  @inject(IntersectionManager)
  private _intersectionManager: IntersectionManager;

  @inject(EffectsManager)
  private _effectsManager: EffectsManager;

  @inject(AudioManager)
  private _audioManager: AudioManager;

  public execute(): void {
    this._intersectionManager.initialize();
    this._effectsManager.initialize();
    this._audioManager.initialize();
  }
}
