'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const entry = require('./entry/test.js');
require('should');

const dummyDependencies = [[helpers.createDummyGenerator(), 'generator-node:app']];

describe('generator-react-app-redux:app', () => {
  test('generator completes', () =>
    helpers
      .run(path.join(__dirname, '../generators/app'))
      .withOptions({ license: false })
      .withPrompts({
        bootstrap: true,
        form: true,
        normalizr: true
      })
      .withGenerators(dummyDependencies));

  test('creates files', () => {
    assert.file([
      'src/actions/app.js',
      'src/components/App.js',
      'src/containers/App.js',
      'src/reducers/app.js',
      'webpack/base.js',
      'webpack/config.json',
      'webpack/dev.js',
      'webpack/dist.js',
      'webpack/entries.js',
      '.babelrc',
      '.gitignore',
      'webpack.config.js',
      'package.json',
      'dist'
    ]);
  });

  test('dependencies', () =>
    fs.readJson('package.json').then(pkg => {
      pkg.dependencies.should.have.properties([
        'redux-thunk',
        'react-bootstrap',
        'redux-form'
      ]);
    }));

  entry({
    runGenerator: false,
    options: {
      name: 'index',
      bootstrap: true,
      form: true,
      normalizr: true,
      thunk: true,
      path: '',
      skipEntryDirectory: true
    },
    prompts: {}
  });
});
