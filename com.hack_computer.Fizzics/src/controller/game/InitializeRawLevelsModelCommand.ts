import { raw } from "../../constants/constants";
import { RawLevelsVOProxy } from "../../models/RawLevelsVOProxy";

export function initializeRawLevelsModelCommand(e: string): void {
  // const game = window.fizzicsGame;
  // const levelsData = game.cache.json.get(Jsones.GameLevels.Name);
  const levelsData = raw;
  const rawLevelsProxy = this.retrieveProxy(RawLevelsVOProxy);

  rawLevelsProxy.initialize(levelsData.levels);
}
