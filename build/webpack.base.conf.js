const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cssnext = require('postcss-cssnext')

const NODE_ENV = process.env.NODE_ENV || 'development'
const ENV_CONFIG = require(`../config/${NODE_ENV}.js`)
const stylusVar = path.resolve(__dirname, '../config/settings.styl')

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}

module.exports = {

  context: resolve('src'),

  entry: {
    main: './js/main.js'
  },

  output: {
    publicPath: '/',
    path: resolve('dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            cssnext()
          ]
        }
      },
      {
        test: /\.js$/,
        include: resolve('/'),
        exclude: resolve('node_modules'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
          {
            loader: 'postcss-loader',
            options: {
              importLoaders: 1,
              parser: 'sugarss',
              plugins: [
                cssnext()
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]'
          // publicPath: resolve('dist'),
          // outputPath: 'assets'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.vue', '.json', '.png', 'styl'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src/js'),
      '@@': resolve('src'),
      stylusVar
    },
    modules: [
      'node_modules'
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(ENV_CONFIG),
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new CopyWebpackPlugin([
      { from: './index.html' }
    ])
  ]
}
