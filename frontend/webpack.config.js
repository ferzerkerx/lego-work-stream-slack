const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: 'dist'
  },
  plugins:[
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      {from:'src/resources',to:'.'}
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env', 'babel-preset-es2015']
          }
        }
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};