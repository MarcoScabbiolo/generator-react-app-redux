'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
require('should');

const dummyDependencies = [[helpers.createDummyGenerator(), 'generator-node:app']];

function runGenerator(prompts = {}, options = {}) {
  return helpers
    .run(path.join(__dirname, '../generators/app'))
    .withOptions(Object.assign({ license: false }, options))
    .withPrompts(prompts)
    .withGenerators(dummyDependencies);
}

function cleanDirectory() {
  return new Promise((res, rej) => {
    helpers.testDirectory(process.cwd(), err => (err ? rej(err) : res()));
  });
}

describe('generator-react-app-redux:app', () => {
  describe('default', () => {
    test('generator completes', runGenerator);

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

    describe.skip('includes dependencies', () => {
      const pkgPromise = fs.readJson('package.json');
      test('base dependencies', () =>
        pkgPromise.then(pkg =>
          pkg.dependencies.should.have.keys(require('../generators/app/dependencies.js'))
        ));
      test('default dependencies', () =>
        pkgPromise.then(pkg => {
          pkg.dependencies.should.have.keys(['redux-thunk']);
          pkg.dependencies.should.not.have.keys(['react-bootstrap', 'redux-form']);
        }));
      test('development dependencies', () =>
        pkgPromise.then(pkg =>
          pkg.dependencies.should.have.keys(
            require('../generators/app/dev-dependencies.js')
          )
        ));
    });

    cleanDirectory();
  });

  describe('react-bootstrap included', () => {
    test('generator completes', runGenerator.bind(null, { boostrap: true }));

    const pkgPromise = fs.readJson('package.json');
    test.skip('includes boostrap', () =>
      pkgPromise.then(pkg => pkg.dependencies.should.have.key('react-bootstrap')));

    cleanDirectory();
  });

  describe('redux-thunk excluded', () => {
    test('generator completes', runGenerator.bind(null, { thunk: false }));

    const pkgPromise = fs.readJson('package.json');
    test.skip('excludes redux-thunk', () =>
      pkgPromise.then(pkg => pkg.dependencies.should.not.have.key('redux-thunk')));

    cleanDirectory();
  });

  describe('redux-form included', () => {
    test('generator completes', runGenerator.bind(null, { form: true }));

    const pkgPromise = fs.readJson('package.json');
    test.skip('includes redux-form', () =>
      pkgPromise.then(pkg => pkg.dependencies.sholud.have.key('redux-form')));

    cleanDirectory();
  });
});
