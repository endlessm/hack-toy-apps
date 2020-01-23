import { SceneKey } from "../../constants/types";

export function disablePhysicsConstraintCommand(e: string): void {
  const scene = window.fizzicsGame.scene.getScene(SceneKey.Game);
  // @ts-ignore
  scene.matter.world.localWorld.constraints = [];
}
