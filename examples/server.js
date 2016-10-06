const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
  contentBase: './examples/',
}).listen(8000, 'localhost', (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log('Listening at http://localhost:8000/');
});
