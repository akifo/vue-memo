const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackBaseConf = require('./webpack.base.conf.js')
const version = require('../package.json').version
const banner =
  `vue-memo v${version}
  (c) 2015-${new Date().getFullYear()} Akiho Nagao
  Released under the MIT license
  https://github.com/akifo/vue-memo`

module.exports = merge(webpackBaseConf, {

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: false
    }),
    new webpack.BannerPlugin(banner)
  ]

})
