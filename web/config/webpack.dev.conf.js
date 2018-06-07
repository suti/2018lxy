const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base.conf')
const path = require('path')

const resolve = dir => path.join(__dirname, '..', dir)

const dev = {
  mode: 'development',
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
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
      '/api/*': {
        target: 'http://localhost:2333',
        secure: false,
      },
    },
  },
  performance: {
    hints: false,
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].style.css',
      allChunks: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
  ],
  devtool: '#eval-source-map',
}

module.exports = merge(base, dev)