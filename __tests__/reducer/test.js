'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const _ = require('lodash');
const reactReduxEnvironment = require('../../generators/ReactReduxEnvironment');
const environment = require('../../generators/reducer/Environment');
require('should');

function testSuite(
  options = {
    runGenerator: true,
    prompts: {
      type: 'simple',
      name: 'test',
      path: 'generator_tests'
    },
    options: {
      actions: {
        app: 'actions/app',
        other: 'actions/other'
      }
    }
  }
) {
  var generator = new (environment(reactReduxEnvironment()))();
  generator.forceConfiguration(options.options, options.prompts);

  describe('generator-react-app-redux:reducer', () => {
    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/reducer'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file([generator._reducerToCreateFilePath]);
    });

    if (generator.props.type === 'composition') {
      test('imports all the reducers', () => {
        _.forIn(generator.props.reducers, (filePath, name) =>
          assert.fileContent(
            generator._reducerToCreateFilePath,
            `import ${name} from '${filePath}';`
          )
        );
      });

      test('combines all the reducers', () => {
        assert.fileContent(
          generator._reducerToCreateFilePath,
          `const reducer = combineReducers({
  ${_.keys(generator.props.reducers).join(`,
  `)}
});`
        );
      });
    } else {
      test('imports all the actions', () => {
        _.forIn(generator.props.actions, (filePath, name) =>
          assert.fileContent(
            generator._reducerToCreateFilePath,
            `import * as ${name} from '${filePath}';`
          )
        );
      });
    }
  });
}

module.exports = testSuite;
