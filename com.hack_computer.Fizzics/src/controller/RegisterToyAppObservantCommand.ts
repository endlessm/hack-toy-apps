import { ToyAppObservant } from "../observants/ToyAppObservant";

export function registerToyAppObservantCommand(e: string): void {
  this.registerObservant(ToyAppObservant);
}
