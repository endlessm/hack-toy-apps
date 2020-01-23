import { SceneKey } from "../../constants/types";

export function enablePhysicsConstraintCommand(e: string): void {
  const scene = window.fizzicsGame.scene.getScene(SceneKey.Game);
  scene.matter.add.pointerConstraint({});
}
