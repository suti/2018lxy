const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const resolve = dir => path.join(__dirname, '..', dir)

const conf = {
  entry: {
    main: resolve('./src/main.js'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              css: ExtractTextPlugin.extract({
                use: 'css-loader',
                fallback: 'vue-style-loader',
              }),
              less: ExtractTextPlugin.extract({
                use: 'css-loader!less-loader',
              }),
            },
          },
        },
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
          },
        },
      },
      {
        test: /\.(ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },

}

module.exports = conf
