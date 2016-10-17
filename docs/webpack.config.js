const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    './docs/index.js',
  ],
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        loader: 'style-loader!css-loader!sass-loader',
        test: /\.scss$/,
        include: path.join(__dirname),
      },
      {
        loader: 'json-loader',
        test: /\.(json)$/,
        include: path.join(__dirname),
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname),
      },
    ],
  },
};
