const config = require('./webpack.config')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const dev = {
  devServer: {
    historyApiFallback: true,
    noInfo: true,

  },
  performance: {
    hints: false
  },
  plugins:[
    new ExtractTextPlugin('style.css'),
  ],
  devtool: '#eval-source-map'
}

module.exports = merge(config,dev)