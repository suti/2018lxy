const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base.conf')
const path = require('path')

const resolve = dir => path.join(__dirname, '..', dir)

const dev = {
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: 'build.js',
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    open: false,
    proxy: {
      '/api*': {
        target: 'http://192.168.43.125:80/',
        secure: false,
      },
      '/db/*': {
        target: 'http://192.168.43.125:80/',
        secure: false,
      },
    },
  },
  performance: {
    hints: false,
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: '#eval-source-map',
}

module.exports = merge(base, dev)