'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const astUtils = require('../../generators/astUtils');
const testUtils = require('../_utils/testUtils');
const fs = require('fs-extra');
const store = require('../store/test');
const reducer = require('../reducer/test');
const component = require('../component/test');
const reactReduxEnvironment = require('../../generators/ReactReduxEnvironment');
const environment = require('../../generators/entry/Environment');
require('should');

const [envIndex, envFoo] = testUtils.testEnvironment(environment);

function testSuite(
  options = {
    skip: false,
    runGenerator: true,
    prompts: {
      bootstrap: true,
      thunk: true,
      form: true,
      normalizr: true
    },
    options: {
      skipEntryDirectory: false,
      path: 'generator_tests',
      name: 'test'
    }
  },
  testEnvironment = false
) {
  var generator = new (environment(reactReduxEnvironment()))();
  generator.forceConfiguration(options.options, options.prompts);

  (options.skip ? describe.skip : describe)('generator-react-app-redux:entry', () => {
    if (testEnvironment) {
      describe('environment', () => {
        test('html entry file path', () => {
          envIndex()._htmlEntryFilePath.should.equal('index.ejs');
          envFoo()._htmlEntryFilePath.should.equal('foo/bar.ejs');
        });

        test('related actions', () => {
          envIndex()._relatedActions.should.deepEqual({
            app: 'actions/app',
            index: 'actions/index'
          });
          envFoo()._relatedActions.should.deepEqual({
            app: 'actions/app',
            bar: 'actions/foo/bar'
          });
        });
      });
    }

    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/entry'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file([generator._jsEntryFilePath, generator._htmlEntryFilePath]);
    });

    describe('file contents', () => {
      test('imports container', () => {
        assert.fileContent(
          generator._jsEntryFilePath,
          `import Main from '${generator._defaultContainerPath}';`
        );
        assert.fileContent(
          generator._jsEntryFilePath,
          `const mainContainerPath = '${generator._defaultContainerPath}';`
        );
      });
      test('imports store', () => {
        assert.fileContent(
          generator._jsEntryFilePath,
          `import configureStore from '${generator._storePath}`
        );
      });
      test('adds entry', () => {
        if (fs.existsSync('webpack/entries.js')) {
          astUtils
            .parse(fs.readFileSync('webpack/entries.js', 'utf-8'))
            .should.have.propertyByPath(
              'program',
              'body',
              0,
              'expression',
              'right',
              'properties'
            )
            .which.is.Array()
            .and.matchAny(function(property) {
              property.should.have.value('type', 'ObjectProperty');
              property.should.have
                .property('key')
                .with.value('name', generator.props.name);
              property.should.have
                .property('value')
                .with.value('value', generator._jsEntryFilePath);
            });
        }
      });
    });

    store({
      runGenerator: false,
      options: {
        form: generator.props.form,
        thunk: generator.props.thunk,
        name: generator.props.name,
        path: generator.props.path,
        normalizr: generator.props.normalizr
      }
    });

    reducer({
      runGenerator: false,
      options: {
        name: generator.props.name,
        path: generator.props.path,
        type: 'section',
        actions: generator._relatedActions
      }
    });

    component({
      runGenerator: false,
      options: {
        bootstrap: generator.props.bootstrap,
        name: generator.props.name,
        path: generator.props.path,
        type: 'section'
      }
    });
  });
}

module.exports = testSuite;
