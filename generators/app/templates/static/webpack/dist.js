const baseWebpackConfiguration = require('./base');

const distributionWebpackConfiguration = Object.assign(baseWebpackConfiguration, {
  devtoool: 'none',
});

module.exports = distributionWebpackConfiguration;
