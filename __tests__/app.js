'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const entry = require('./entry/test.js');
const expect = require('chai').expect;
const astUtils = require('../generators/astUtils');

const dummyDependencies = [[helpers.createDummyGenerator(), 'generator-node:app']];

const assertBabelrc = babelrc =>
  expect(babelrc)
    .to.have.property('plugins')
    .which.is.an('array')
    .and.includes('transform-object-rest-spread');

const assertAppComponentBootstrapFileContents = (includes = true) => {
  let assertComponent = includes ? assert.fileContent : assert.noFileContent;
  return function() {
    assertComponent(
      'src/components/App.js',
      "import '../../node_modules/bootstrap/dist/css/bootstrap.css';"
    );
    assertComponent(
      'src/components/App.js',
      "import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';"
    );
  };
};

describe('generator-react-app-redux:app', () => {
  test('generator completes', () =>
    helpers
      .run(path.join(__dirname, '../generators/app'))
      .withOptions({ license: false })
      .withPrompts({
        bootstrap: true,
        form: true,
        thunk: true,
        normalizr: true,
        webpackdashboard: true,
        sections: true,
        entities: true,
        reacthocloading: true,
        reactbootstraphocerror: true,
        reduxloaderror: true
      })
      .withGenerators(dummyDependencies));

  test('creates files', () => {
    assert.file([
      'src/actions/app.js',
      'src/components/App.js',
      'src/components/app.scss',
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
      'package.json'
    ]);
  });

  describe('file contents', () => {
    test('imports react-boostrap', assertAppComponentBootstrapFileContents());

    test('babelrc', () => fs.readJson('.babelrc').then(assertBabelrc));
    test('gitignore', () =>
      fs
        .readFile('.gitignore', 'utf-8')
        .then(contents => expect(contents.indexOf('dist/*')).not.to.equal(-1)));

    test('dependencies', () =>
      fs.readJson('package.json').then(pkg => {
        expect(pkg.scripts.start.indexOf('webpack-dashboard')).to.not.equal(-1);
        expect(pkg.dependencies).to.include.all.keys(
          'redux-thunk',
          'react-bootstrap',
          'react-hoc-loading',
          'react-bootstrap-hoc-error',
          'redux-load-error',
          'redux-form',
          'normalizr'
        );
        expect(pkg.devDependencies).to.include.all.keys('webpack-dashboard');
      }));

    test('webpack config', () =>
      fs.readJson('webpack/config.json').then(webpack => {
        expect(webpack.defaultTemplate).to.equal('ejs');
        expect(webpack.dashboard).to.equal(true);
      }));

    test('eslint config', () => {
      assert.jsonFileContent('package.json', {
        eslintConfig: {
          parser: 'babel-eslint',
          extends: ['xo', 'prettier', 'plugin:react/recommended'],
          env: {
            browser: true
          }
        }
      });
    });
  });

  entry({
    runGenerator: false,
    options: {
      name: 'main',
      bootstrap: true,
      form: true,
      normalizr: true,
      thunk: true,
      path: '',
      skipEntryDirectory: true,
      sections: true,
      entities: true,
      reacthocloading: true,
      reactbootstraphocerror: true,
      reduxloaderror: true,
      reducer: false
    },
    prompts: {}
  });
});

describe('generator-react-app-redux:app:2', () => {
  test('generator completes', () =>
    helpers
      .run(path.join(__dirname, '../generators/app'))
      .withOptions({ license: false })
      .withPrompts({
        bootstrap: false,
        form: false,
        normalizr: false,
        thunk: false,
        dashboard: false,
        sections: false,
        entities: false,
        reacthocloading: false,
        reactbootstraphocerror: false,
        reduxloaderror: false
      })
      .withGenerators(dummyDependencies)
      .inTmpDir(dir => {
        fs.writeFileSync(path.join(dir, '.babelrc'), '{ "dummy": "dummy" }');
      }));

  describe('file contents', () => {
    test('keeps original .babelrc', () =>
      fs.readJson('.babelrc').then(babelrc => {
        assertBabelrc(babelrc);
        expect(babelrc).to.have.property('dummy', 'dummy');
      }));

    test(
      'does not import react-boostrap',
      assertAppComponentBootstrapFileContents(false)
    );

    test('dependencies', () =>
      fs.readJson('package.json').then(pkg => {
        expect(pkg.scripts.start.indexOf('webpack-dashboard')).to.equal(-1);
        expect(pkg.dependencies).not.to.include.any.keys(
          'redux-thunk',
          'react-bootstrap',
          'react-hoc-loading',
          'react-bootstrap-hoc-error',
          'redux-load-error',
          'redux-form',
          'normalizr'
        );
        expect(pkg.devDependencies).not.to.include.any.keys('webpack-dashboard');
      }));

    test('webpack config', () =>
      fs.readJson('webpack/config.json').then(webpack => {
        expect(webpack.dashboard).to.equal(false);
      }));
  });

  entry({
    runGenerator: false,
    options: {
      name: 'main',
      bootstrap: false,
      form: false,
      normalizr: false,
      thunk: false,
      path: '',
      skipEntryDirectory: true,
      reacthocloading: false,
      reactbootstraphocerror: false,
      reduxloaderror: false,
      sections: false,
      entities: false,
      reducer: false
    },
    prompts: {}
  });
});

describe('ast utils completion', () => {
  assert.throws(() => astUtils.importAll({}, 'something'));
});
