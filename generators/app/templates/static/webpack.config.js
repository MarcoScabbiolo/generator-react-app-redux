'use strict';
const assert = require('assert');

module.exports = (env = 'dev') => {
  assert.ok(
    ['dev', 'dist'].includes(env),
    `Unknown environment ${env}, use dev for development and dist to build`
  );

  process.env.NODE_ENV = env;

  return require(`./webpack/${env}.js`);
}