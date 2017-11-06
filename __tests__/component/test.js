'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const reactReduxEnvironment = require('../../generators/ReactReduxEnvironment');
const environment = require('../../generators/component/Environment');
const testUtils = require('../_utils/testUtils');
require('should');

function testSuite(
  options = {
    runGenerator: true,
    prompts: {
      type: 'standard',
      name: 'test',
      path: 'generator_tests',
      container: true,
      bootstrap: true
    },
    options: {}
  }
) {
  var generator = new (environment(reactReduxEnvironment()))();
  generator.forceConfiguration(options.options, options.prompts);

  describe('generator-react-app-redux:component', () => {
    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/component'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file([generator._componentToCreateFilePath]);
    });

    testUtils.testFileContentsByProp({
      testTrue: 'imports react-bootstrap',
      testFalse: 'does not import react-bootrap',
      prop: generator.props.bootstrap,
      file: generator._componentToCreateFilePath,
      content: "import * as B from 'react-bootstrap';"
    });
  });
}

module.exports = testSuite;