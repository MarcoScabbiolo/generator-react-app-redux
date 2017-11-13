const baseWebpackConfiguration = require('./base');

const distributionWebpackConfiguration = Object.assign(baseWebpackConfiguration, {
  devtool: 'none',
});

module.exports = distributionWebpackConfiguration;
