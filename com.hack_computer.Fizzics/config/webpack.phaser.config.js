const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    index: `./scripts/phaserCustomBuild.js`,
  },

  resolve: {
    alias: {
      eventemitter3: path.resolve('node_modules/eventemitter3'),
      SpineCanvas: './runtimes/spine-canvas.js',
      SpineWebGL: './runtimes/spine-webgl.js',
    },
    modules: ['node_modules/phaser'],
  },

  output: {
    path: path.resolve('src/phaser/'),
    filename: '[name].js',
    library: 'Phaser',
    libraryTarget: 'umd',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
    devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]',
    umdNamedDefine: true,
  },

  module: {
    rules: [
      {
        test: /spine-canvas\.js/,
        use: 'imports-loader?this=>window',
      },
      {
        test: /spine-canvas\.js/,
        use: 'exports-loader?spine',
      },
      {
        test: /spine-webgl\.js/,
        use: 'imports-loader?this=>window',
      },
      {
        test: /spine-webgl\.js/,
        use: 'exports-loader?spine',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof EXPERIMENTAL': JSON.stringify(false),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
      'typeof PLUGIN_SPINE_WEBGL': JSON.stringify(false),
      'typeof PLUGIN_SPINE_CANVAS': JSON.stringify(false),
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['src/phaser'],
      root: path.resolve(__dirname, '..'),
      verbose: true,
    }),
  ],
}
