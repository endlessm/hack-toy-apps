export class Ticker {
  private __actors: Set<any> = new Set();

  public get actors(): Set<any> {
    return this.__actors;
  }

  public add(fn: any): void {
    this.__actors.add(fn);
  }

  public remove(fn: any): void {
    this.__actors.delete(fn);
  }

  public update(time: number, delta: number): void {
    this.__actors.forEach((actor: any) => actor(time, delta));
  }
}
