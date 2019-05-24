require("src/polyfills");

var CONST = require("src/const");
var Extend = require("src/utils/object/Extend");

var Phaser = {
  // Types: {
  //   Core: {
  //     GameConfig: {}
  //   }
  // },

  Display: {
    Align: {
      In: {
        TopCenter: require("src/display/align/in/TopCenter"),
        BottomCenter: require("src/display/align/in/BottomCenter"),
        Center: require("src/display/align/in/Center"),
        LeftCenter: require("src/display/align/in/LeftCenter"),
        RightCenter: require("src/display/align/in/RightCenter")
      },
      To: {
        TopCenter: require("src/display/align/to/TopCenter"),
        BottomCenter: require("src/display/align/to/BottomCenter"),
        RightCenter: require("src/display/align/to/RightCenter"),
        LeftCenter: require("src/display/align/to/LeftCenter")
      }
    }
  },

  Cameras: {
    Scene2D: require("src/cameras/2d")
  },

  Events: require("src/events/EventEmitter"),

  Game: require("src/core/Game"),

  Scene: require("src/scene/Scene"),

  Scale: require("src/scale"),

  Scenes: { ScenePlugin: require("src/scene/ScenePlugin") },

  GameObjects: {
    DisplayList: require("src/gameobjects/DisplayList"),

    UpdateList: require("src/gameobjects/UpdateList"),

    BuildGameObject: require("src/gameobjects/BuildGameObject"),

    GameObjectFactory: require("src/gameobjects/GameObjectFactory"),

    RenderTexture: require("src/gameobjects/rendertexture/RenderTexture"),

    Image: require("src/gameobjects/image/Image"),

    Container: require("src/gameobjects/container/Container"),

    BitmapText: require("src/gameobjects/bitmaptext/static/BitmapText"),

    Graphics: require("src/gameobjects/graphics/Graphics"),

    Factories: {
      Image: require("src/gameobjects/image/ImageFactory"),
      Container: require("src/gameobjects/container/ContainerFactory"),
      BitmapText: require("src/gameobjects/bitmaptext/static/BitmapTextFactory"),
      Graphics: require("src/gameobjects/graphics/GraphicsFactory"),
      Rectangle: require("src/gameobjects/shape/rectangle/RectangleFactory"),
      Line: require("src/gameobjects/shape/line/LineFactory"),
      Arc: require("src/gameobjects/shape/arc/ArcFactory")
    }
  },

  Loader: {
    FileTypes: {
      ImageFile: require("src/loader/filetypes/ImageFile"),
      AtlasJSONFile: require("src/loader/filetypes/AtlasJSONFile"),
      BitmapFont: require("src/loader/filetypes/BitmapFontFile"),
      AudioFile: require("src/loader/filetypes/AudioFile")
    },

    LoaderPlugin: require("src/loader/LoaderPlugin")
  },

  Math: {
    Distance: {
      Between: require("src/math/distance/DistanceBetween")
    }
  },

  Geom: {
    Point: require("src/geom/point/Point"),
    Rectangle: require("src/geom/rectangle/Rectangle")
  },

  Plugins: {
    BasePlugin: require("src/plugins/BasePlugin"),
    ScenePlugin: require("src/plugins/ScenePlugin")
  },

  Tweens: { TweenManager: require("src/tweens/TweenManager") },

  Input: {
    InputPlugin: require("src/input/InputPlugin")
  },

  Clock: { TimerEvent: require("src/time/Clock") },

  Physics: {
    Matter: require("src/physics/matter-js")
  }
};

if (typeof PLUGIN_CAMERA3D) {
  Phaser.Cameras.Sprite3D = require("plugins/camera3d/src");
  Phaser.GameObjects.Sprite3D = require("plugins/camera3d/src/sprite3d/Sprite3D");
  Phaser.GameObjects.Factories.Sprite3D = require("plugins/camera3d/src/sprite3d/Sprite3DFactory");
  Phaser.GameObjects.Creators.Sprite3D = require("plugins/camera3d/src/sprite3d/Sprite3DCreator");
}

if (typeof PLUGIN_FBINSTANT) {
  Phaser.FacebookInstantGamesPlugin = require("plugins/fbinstant/src/FacebookInstantGamesPlugin");
}

if (typeof PLUGIN_SPINE_WEBGL) {
  Phaser.SpineWebGLPlugin = require("plugins/spine/src/SpineWebGLPlugin");
}

if (typeof PLUGIN_SPINE_CANVAS) {
  Phaser.SpineCanvasPlugin = require("plugins/spine/src/SpineCanvasPlugin");
}

//  Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;
