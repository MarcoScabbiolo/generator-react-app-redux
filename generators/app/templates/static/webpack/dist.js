const baseWebpackConfiguration = require('./base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const distributionWebpackConfiguration = Object.assign(baseWebpackConfiguration, {
  devtool: 'none',
});

distributionWebpackConfiguration.plugins.push(new UglifyJsPlugin({ test: /\.(js|jsx)$/ }))

module.exports = distributionWebpackConfiguration;
