const baseWebpackConfiguration = require('./base');
const webpack = require('webpack');

const developmentWebpackConfiguration = Object.assign(baseWebpackConfiguration, {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  }
});

developmentWebpackConfiguration.entry.hmr = 'react-hot-loader/patch';
developmentWebpackConfiguration.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = developmentWebpackConfiguration;
