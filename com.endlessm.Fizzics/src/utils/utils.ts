import { TRANSFORM } from "..";

export function isEmpty(arr: any[]): boolean {
  return arr.length === 0;
}

export const getUUID = (() => {
  let num = 0;

  return (prefix = "") => {
    num += 1;
    const value = num < 10 ? `0${num}` : num;

    return `${prefix}${value.toString()}`;
  };
})();

export function lineAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.atan2(y1 - y2, x1 - x2) + Math.PI / 2;
}

export function getCircularReplacer(): (key: string, value: object) => object {
  const seen = new WeakSet();

  return (key: string, value: object) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }

    return value;
  };
}

export function postRunnable(
  scene: Phaser.Scene,
  runnable: any,
  context: any,
  ...args: any[]
): Phaser.Time.TimerEvent {
  return addRunnable(scene, 0, runnable, context, false, ...args);
}

export function delayRunnable(
  scene: Phaser.Scene,
  delay: number,
  runnable: any,
  context: any,
  ...args: any[]
): Phaser.Time.TimerEvent {
  return addRunnable(scene, delay, runnable, context, false, ...args);
}

export function loopRunnable(
  scene: Phaser.Scene,
  delay: number,
  runnable: any,
  context: any,
  fireImmediately: boolean,
  ...args: any[]
): Phaser.Time.TimerEvent {
  fireImmediately && runnable.call(context, ...args);

  return addRunnable(scene, delay, runnable, context, true, ...args);
}

export function removeRunnable(runnable: Phaser.Time.TimerEvent): void {
  if (!runnable) {
    return;
  }
  runnable.remove();
  runnable.destroy();
}

function addRunnable(
  scene: Phaser.Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  loop: boolean,
  ...args: any[]
): Phaser.Time.TimerEvent {
  return scene.time.addEvent({
    delay,
    callback: runnable,
    callbackScope: context,
    loop,
    args
  });
}

export function isInBounds(x: number, y: number): boolean {
  const { width, height } = TRANSFORM;

  return new Phaser.Geom.Rectangle(0, 0, width, height).contains(x, y);
}

export function random(min: number, max: number, toFixed: number = 0): number {
  const diff = Math.max(min - max, max - min) * Math.random();

  return +(Math.min(min, max) + diff).toFixed(toFixed);
}

export function sample(array: any[]) {
  return array[random(0, array.length - 1)];
}

export function getEnumKeys(e: any): any[] {
  return Object.keys(e).filter((k: any) => typeof e[k as any] === "number");
}

export function getEnumValues(e: any): any[] {
  return getEnumKeys(e).map((k: any) => e[k as any]);
}
