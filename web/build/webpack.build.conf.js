const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const path = require('path')

const resolve = dir => path.join(__dirname, '..', dir)

const config = {
  output: {
    path: resolve('dist/html'),
    publicPath: '/html/',
    filename: 'build.js',
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('index.html')
    })
  ],
}

module.exports = merge(base, config)