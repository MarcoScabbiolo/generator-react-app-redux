'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const testUtils = require('../_utils/testUtils');
const environment = require('../../generators/ReactReduxEnvironment');
const reducer = require('../reducer/test');

function testSuite(
  options = {
    skip: false,
    runGenerator: true,
    prompts: {
      form: true,
      thunk: true,
      normalizr: true,
      sections: false,
      entities: false,
      name: 'test',
      path: 'generator_tests'
    },
    options: {}
  }
) {
  var generator = new (environment())();
  generator.forceConfiguration(options.options, options.prompts);

  (options.skip ? describe.skip : describe)('generator-react-app-redux:store', () => {
    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/store'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file(
        [generator._rootReducerFilePath, generator._storeFilePath]
          .concat(
            generator.props.sections
              ? [generator._resolveSectionsReducerFilePath(generator.props.name)]
              : []
          )
          .concat(generator.props.entities ? [generator._entitiesReducerFilePath] : [])
      );
    });

    describe('file contents', () => {
      testUtils.testFileContentsByProp({
        testTrue: 'imports redux-form',
        testFalse: 'does not import redux-form',
        prop: generator.props.form,
        file: generator._rootReducerFilePath,
        content: "import { reducer as form } from 'redux-form';"
      });

      test('imports reducer in store', () => {
        assert.fileContent(
          generator._storeFilePath,
          `import mainReducer from '${generator._rootReducerPath}';`
        );
      });

      testUtils.testFileContentsByProp({
        testTrue: 'imports the main reducer',
        testFalse: 'does not import the main reducer',
        prop: !generator.props.entities && !generator.props.sections,
        file: generator._rootReducerFilePath,
        content: `import main from '${generator._reducerPath('main')}';`
      });

      testUtils.testFileContentsByProp({
        testTrue: 'imports the entities reducer',
        testFalse: 'does not import the entities reducer',
        prop: generator.props.entities,
        file: generator._rootReducerFilePath,
        content: `import entities from '${generator._entitiesReducerPath}';`
      });

      testUtils.testFileContentsByProp({
        testTrue: 'imports the sections reducer',
        testFalse: 'does not import the sections reducer',
        prop: generator.props.sections,
        file: generator._rootReducerFilePath,
        content: `import sections from '${generator._sectionsReducerPath}';`
      });

      testUtils.testFileContentsByProp({
        testTrue: 'imports redux-thunk',
        testFalse: 'does not import redux-thunk',
        prop: generator.props.thunk,
        file: generator._storeFilePath,
        content: "import thunk from 'redux-thunk';"
      });

      if (generator.props.entities) {
        testUtils.testFileContentsByProp({
          testTrue: 'imports normalizr',
          testFalse: 'does not import normalizr',
          prop: generator.props.normalizr,
          file: generator._entitiesReducerFilePath,
          content: "import { normalize, schema } from 'normalizr';"
        });
      }
    });
  });

  if (!generator.props.sections && !generator.props.entities) {
    reducer({
      runGenerator: false,
      options: {
        name: 'main',
        path: generator._resolvedPath,
        type: 'simple',
        actions: generator._relatedActions,
        logScaffoldingPath: false
      }
    });
  }
}

module.exports = testSuite;
