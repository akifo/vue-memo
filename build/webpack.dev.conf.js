const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackBaseConf = require('./webpack.base.conf.js')

module.exports = merge(webpackBaseConf, {

  devtool: '#inline-source-map',

  plugins: [
    new FriendlyErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    // compress: true,
    hot: true,
    // inline: true,
    // open: true,
    port: 8080,
    contentBase: path.join(__dirname, '../dist')
  }

})
