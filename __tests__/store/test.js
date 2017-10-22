'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
require('should');

const formImportStatement = "import { reducer as form } from 'redux-form';";
const thunkImportStatement = "import thunk from 'redux-thunk'";

function testSuite(
  options = {
    runGenerator: true,
    prompts: {
      form: true,
      thunk: true,
      name: 'test',
      path: 'generator_tests'
    },
    options: {}
  }
) {
  describe('generator-react-app-redux:store', () => {
    const formEnabled = options.prompts.form || options.options.form;
    const thunkEnabled = options.prompts.thunk || options.options.thunk;
    const nameProp = options.prompts.name || options.options.name;
    const pathProp = options.prompts.path || options.options.path;
    const resolvedPath = path.join(pathProp, nameProp);
    const rootReducerFilePath = `reducer/${resolvedPath}.js`;
    const storeFilePath = `stores/${resolvedPath}.js`;

    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/store'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file([rootReducerFilePath, storeFilePath]);
    });

    describe('file contents', () => {
      if (formEnabled) {
        test('imports redux-form', () => {
          assert.fileContent(rootReducerFilePath, formImportStatement);
        });
      } else {
        test('does not import redux-form', () => {
          assert.noFileContent(rootReducerFilePath, formImportStatement);
        });
      }
      test('imports reducer in store', () => {
        assert.fileContent(
          storeFilePath,
          `import mainReducer from 'reducers/${resolvedPath}`
        );
      });
      if (thunkEnabled) {
        test('imports redux-thunk', () => {
          assert.fileContent(storeFilePath, thunkImportStatement);
        });
      } else {
        test('does not import redux-thunk', () => {
          assert.noFileContent(storeFilePath, thunkImportStatement);
        });
      }
    });
  });
}

module.exports = testSuite;
