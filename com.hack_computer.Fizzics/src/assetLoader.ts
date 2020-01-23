function loadAssets(
  scene: Phaser.Scene,
  loaderName: string,
  checker: (name: string) => boolean,
  node: any,
  keys: string[],
  autoStartLoader: boolean,
  scalingVariant?: ScalingVariant,
): void {
  if (typeof node === 'function') {
    if (!checker(node.Name)) {
      (scene.load as any)[loaderName](
        node.Name,
        ...keys.map((key: string) => {
          if (scalingVariant) {
            const url: string = node[key];
            const parts: string[] = url.split('.');
            return `${parts[0]}-${scalingVariant}.${parts[1]}`;
          }
          return node[key];
        }),
      );
    } else {
      // ...
    }
  } else {
    for (const child of Object.keys(node)) {
      loadAssets(
        scene,
        loaderName,
        checker,
        node[child],
        keys,
        autoStartLoader,
        scalingVariant,
      );
    }
  }
  if (autoStartLoader) {
    scene.load.start();
  }
}

export function loadImages(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
  scalingVariant?: ScalingVariant,
): void {
  loadAssets(
    scene,
    'image',
    scene.textures.exists.bind(scene.textures),
    node,
    ['FileURL'],
    autoStartLoader,
    scalingVariant,
  );
}

export function loadBitmapfonts(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
): void {
  loadAssets(
    scene,
    'bitmapFont',
    scene.textures.exists.bind(scene.textures),
    node,
    ['PngURL', 'XmlURL'],
    autoStartLoader,
  );
}

export function loadAtlases(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
  scalingVariant?: ScalingVariant,
): void {
  loadAssets(
    scene,
    'atlas',
    scene.textures.exists.bind(scene.textures),
    node,
    ['TextureURL', 'AtlasURL'],
    autoStartLoader,
    scalingVariant,
  );
}

export function loadSpines(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
  scalingVariant?: ScalingVariant,
): void {
  loadAssets(
    scene,
    'spine',
    //@ts-ignore
    scene.spine.cache.exists.bind(scene.spine.cache),
    node,
    ['SkeletonURL', 'AtlasURL'],
    autoStartLoader,
    scalingVariant,
  );
}

export function loadJson(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
): void {
  loadAssets(
    scene,
    'json',
    scene.cache.json.exists.bind(scene.cache.json),
    node,
    ['FileURL'],
    autoStartLoader,
  );
}

export function loadText(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
  scalingVariant?: ScalingVariant,
): void {
  loadAssets(
    scene,
    'text',
    scene.cache.text.exists.bind(scene.cache.text),
    node,
    ['FileURL'],
    autoStartLoader,
    scalingVariant,
  );
}

export function loadAudio(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
): void {
  loadAssets(
    scene,
    'audio',
    scene.cache.audio.exists.bind(scene.cache.audio),
    node,
    ['Mp3URL', 'OggURL'],
    autoStartLoader,
  );
}

export enum ScalingVariant {
  HD = 'hd',
  SD = 'sd',
}
