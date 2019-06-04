export abstract class AbstractSound {
  public abstract play(key: string, loop?: boolean): void;
  public abstract stop(key: string): void;
  public abstract update(key: string, rate: number): void;
}

export class ToyAppSound extends AbstractSound {
  public play(key: string, loop: boolean = false): void {
    loop ? window.Sounds.playLoop(key) : window.Sounds.play(key);
  }

  public stop(key: string): void {
    window.Sounds.stop(key);
  }

  public update(key: string, rate: number): void {
    window.Sounds.updateSound(key, 100, { rate });
  }
}

export class WebAppSound extends AbstractSound {
  public play(key: string, loop: boolean = false): void {
    console.log(`play sound key: ${key} loop: ${loop}`);
  }

  public stop(key: string): void {
    console.log(`stop sound key: ${key}`);
  }

  public update(key: string, rate: number): void {
    console.log(`update sound key: ${key}, rate: ${rate}`);
  }
}
