const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const path = require('path')

const resolve = dir => path.join(__dirname, '..', dir)

const config = {
  entry: [resolve('./src/main.js')],
  output:
    {
      path: resolve('html'),
      publicPath: '/html/',
      filename: 'build.js',
    },

}

module.exports = merge(base, config)