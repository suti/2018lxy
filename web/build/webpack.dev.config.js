const config = require('./webpack.config')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const dev = {
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    open: false
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

module.exports = merge(config, dev)