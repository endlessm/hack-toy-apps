import { toyAppEnvironmentGuard } from "./guards/ToyAppEnvironmentGuard";
import { registerToyAppObservantCommand } from "./RegisterToyAppObservantCommand";

export function startupCommand(e: string): void {
  this.executeCommandWithGuard(
    toyAppEnvironmentGuard,
    e,
    registerToyAppObservantCommand
  );
}
