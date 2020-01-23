const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const parts = require('./webpack.parts.config')

const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/index.ts'),
  dist: path.resolve('app'),
  template: path.resolve('index.html'),
  tsConfigDev: path.resolve('tsconfig.dev.json'),
}

const commonConfig = merge([
  {
    target: 'web',
    context: paths.base,
    entry: paths.app,
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '',
      path: paths.dist,
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new CopyWebpackPlugin([
        {
          from: '../assets',
          to: 'assets',
        },
      ]),
    ],
  },
])

const developmentConfig = merge([
  parts.sourceMaps('cheap-module-source-map'),

  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),

  { plugins: [new webpack.NamedModulesPlugin()] },

  parts.envVar('development'),
  parts.loadJs({
    options: {
      configFile: paths.tsConfigDev,
    },
  }),
])

const developmentDeviceConfig = merge([
  parts.envVar('device'),
  developmentConfig,
])

const productionConfig = merge([
  parts.sourceMaps('source-map'),

  parts.cleanup([
    path.resolve(paths.dist, 'game'),
    path.resolve(paths.dist, 'assets'),
  ]),

  parts.envVar('production'),

  {
    performance: {
      maxEntrypointSize: 2000000,
      maxAssetSize: 1100000,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.js$/,
          terserOptions: {
            output: {
              comments: false,
            },
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
  },
  parts.loadJs({}),
])

const analyzeConfig = merge([parts.analyze()])

module.exports = env => {
  let envConfig
  switch (env) {
    case 'production':
      envConfig = productionConfig
      break
    case 'device':
      envConfig = developmentDeviceConfig
      break
    default:
      envConfig = developmentConfig
      break
  }
  const config = merge(
    commonConfig,
    {
      stats: 'minimal',
    },
    envConfig,
  )
  if (process.env.npm_config_analyze) {
    return merge(config, analyzeConfig)
  }

  return config
}
