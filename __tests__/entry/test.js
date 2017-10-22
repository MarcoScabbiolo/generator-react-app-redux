'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const esprima = require('esprima');
const fs = require('fs-extra');
const store = require('../store/test.js');
require('should');

function testSuite(
  options = {
    runGenerator: true,
    prompts: {
      bootstrap: true,
      thunk: true,
      form: true,
      name: 'test',
      path: 'generator_tests'
    },
    options: {
      skipEntryDirectory: false
    }
  }
) {
  describe('generator-react-app-redux:entry', () => {
    const thunkProp = options.prompts.thunk || options.options.thunk;
    const formProp = options.prompts.form || options.options.form;
    const nameProp = options.prompts.name || options.options.name;
    const pathProp = options.prompts.path || options.options.path;
    const jsFilePath = `${nameProp}.js`;
    const ejsFilePath = options.options.skipEntryDirectory
      ? 'index.ejs'
      : `${nameProp}/index.ejs`;
    const resolvedPath = path.join(pathProp, nameProp);

    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/entry'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file([jsFilePath, ejsFilePath]);
    });

    describe('file contents', () => {
      test('imports container', () => {
        assert.fileContent(jsFilePath, `import Main from 'containers/${resolvedPath}';`);
        assert.fileContent(
          jsFilePath,
          `const mainContainerPath = 'containers/${resolvedPath}';`
        );
      });
      test('imports store', () => {
        assert.fileContent(
          jsFilePath,
          `import configureStore from 'stores/${resolvedPath}`
        );
      });
      test('adds entry', () => {
        esprima
          .parse(fs.readFileSync('webpack/entries.js', 'utf-8'))
          .should.have.propertyByPath('body', 0, 'expression', 'right', 'properties')
          .which.is.Array()
          .and.matchAny(function(property) {
            property.should.have.value('type', 'Property');
            property.should.have.property('key').with.value('name', nameProp);
            property.should.have.property('value').with.value('value', jsFilePath);
          });
      });
    });

    store({
      runGenerator: false,
      options: {
        form: formProp,
        thunk: thunkProp,
        name: nameProp,
        path: pathProp
      },
      prompts: {}
    });
  });
}

module.exports = testSuite;
