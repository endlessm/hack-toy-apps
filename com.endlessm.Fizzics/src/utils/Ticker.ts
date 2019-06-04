export class Ticker {
  private readonly _actors: Set<
    (time: number, delta: number) => void
  > = new Set();

  public get actors(): Set<(time: number, delta: number) => void> {
    return this._actors;
  }

  public add(fn: (time: number, delta: number) => void): void {
    this._actors.add(fn);
  }

  public remove(fn: (time: number, delta: number) => void): void {
    this._actors.delete(fn);
  }

  public update(time: number, delta: number): void {
    this._actors.forEach((actor: (time: number, delta: number) => void) => {
      actor(time, delta);
    });
  }
}
