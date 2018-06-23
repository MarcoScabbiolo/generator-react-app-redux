'use strict';
const helpers = require('yeoman-test');
const path = require('path');
const assert = require('chai').assert;

describe('react-app-redux:component', () => {
  test('fails if a bad component name is provided', () =>
    helpers
      .run(path.join(__dirname, '../generators/component'))
      .withPrompts({
        type: 'standard',
        name: 'badname.js',
        path: 'generator_tests',
        container: false,
        bootstrap: false,
        stylesheet: false,
        reacthocloading: false,
        reactbootstraphocerror: false,
        reducer: false
      })
      .then(() => {
        throw new Error('Generator should not complete');
      })
      .catch(err => assert.include(err.message, 'Unexpected token, expected {')));
});
