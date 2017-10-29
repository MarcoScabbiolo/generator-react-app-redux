'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const esprima = require('esprima');
const fs = require('fs-extra');
const store = require('../store/test.js');
const reactReduxEnvironment = require('../../generators/ReactReduxEnvironment');
const environment = require('../../generators/entry/Environment');
require('should');

function testSuite(
  options = {
    skip: false,
    runGenerator: true,
    prompts: {
      bootstrap: true,
      thunk: true,
      form: true,
      normalizr: true,
      name: 'test',
      path: 'generator_tests'
    },
    options: {
      skipEntryDirectory: false
    }
  }
) {
  var generator = new (environment(reactReduxEnvironment()))();
  generator.forceConfiguration(options.options, options.prompts);

  (options.skip ? describe.skip : describe)('generator-react-app-redux:entry', () => {
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
        esprima
          .parse(fs.readFileSync('webpack/entries.js', 'utf-8'))
          .should.have.propertyByPath('body', 0, 'expression', 'right', 'properties')
          .which.is.Array()
          .and.matchAny(function(property) {
            property.should.have.value('type', 'Property');
            property.should.have.property('key').with.value('name', generator.props.name);
            property.should.have
              .property('value')
              .with.value('value', generator._jsEntryPath);
          });
      });
    });

    store({
      runGenerator: false,
      options: {
        form: generator.props.form,
        thunk: generator.props.thunk,
        name: generator.props.name,
        path: generator.props.path
      },
      prompts: {}
    });
  });
}

module.exports = testSuite;
