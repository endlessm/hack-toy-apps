export function initializeNinePatchCommand(e: string): void {
  const game = window.fizzicsGame;

  game.cache.custom.ninePatch.add("level_bg", {
    top: 2,
    bottom: 16,
    left: 16,
    right: 2
  });
  game.cache.custom.ninePatch.add("diamond_bg", {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1
  });
  game.cache.custom.ninePatch.add("fling_bg", {
    top: 2,
    bottom: 16,
    left: 2,
    right: 16
  });
  game.cache.custom.ninePatch.add("tools_bg", {
    top: 6,
    bottom: 6,
    left: 6,
    right: 6
  });
  game.cache.custom.ninePatch.add("next_level_bg", {
    top: 22,
    bottom: 22,
    left: 22,
    right: 22
  });
  game.cache.custom.ninePatch.add("next_level_button", {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  });
}
