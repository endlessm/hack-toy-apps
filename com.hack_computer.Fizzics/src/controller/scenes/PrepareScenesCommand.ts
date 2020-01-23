import { SceneKey } from "../../constants/types";

export function prepareScenesCommand(e: string): void {
  const game = window.fizzicsGame;

  game.scene.start(SceneKey.Background);
  game.scene.start(SceneKey.Game);
  game.scene.start(SceneKey.UI);
  game.scene.start(SceneKey.LevelComplete);

  game.scene.sleep(SceneKey.Background);
  game.scene.sleep(SceneKey.Game);
  game.scene.sleep(SceneKey.UI);
  game.scene.sleep(SceneKey.LevelComplete);

  game.scene.remove(SceneKey.Preload);
}
