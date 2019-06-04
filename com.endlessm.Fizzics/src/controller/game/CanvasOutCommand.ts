import { scenePointerUpCommand } from "./ScenePointerUpCommand";

export function canvasOutCommand(e: string): void {
  this.executeCommand(e, scenePointerUpCommand);
}
