const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const reactReduxEnvironment = require('../../generators/ReactReduxEnvironment');
const environment = require('../../generators/component/Environment');
const testUtils = require('../_utils/testUtils');
const chai = require('chai');
const container = require('../container/test');
const _ = require('lodash');

const [envMain, envFoo] = testUtils.testEnvironment(environment, { type: 'section' });

function testSuite(
  options = {
    runGenerator: true,
    prompts: {
      type: 'standard',
      name: 'test',
      path: 'generator_tests',
      container: true,
      bootstrap: true,
      stylesheet: false
    },
    options: {
      reacthocloading: false,
      reactbootstraperror: false
    }
  },
  testEnvironment = false
) {
  var generator = new (environment(reactReduxEnvironment()))();
  generator.forceConfiguration(options.options, options.prompts);

  describe('generator-react-app-redux:component', () => {
    if (testEnvironment) {
      describe('environment', () => {
        test('returns', () => {
          chai.assert.exists(new (environment())());
        });

        test('component to create path', () => {
          chai.expect(envMain()._componentToCreatePath).to.equal('components/main');
          chai
            .expect(envMain()._componentToCreateFilePath)
            .to.equal('src/components/main.js');
          chai.expect(envFoo()._componentToCreatePath).to.equal('components/foo/bar');
          chai
            .expect(envFoo()._componentToCreateFilePath)
            .to.equal('src/components/foo/bar.js');
        });

        test('stylesheet to create path', () => {
          chai
            .expect(envMain()._stylesheetToCreateFilePath)
            .to.equal('src/components/main.scss');
          chai
            .expect(envFoo()._stylesheetToCreateFilePath)
            .to.equal('src/components/foo/bar.scss');
        });
      });
    }
    if (options.runGenerator) {
      test('generator completes', () =>
        helpers
          .run(path.join(__dirname, '../../generators/component'))
          .withOptions(options.options)
          .withPrompts(options.prompts));
    }

    test('creates files', () => {
      assert.file([generator._componentToCreateFilePath]);
      if (generator.props.stylesheet) {
        assert.file([generator._stylesheetToCreateFilePath]);
      } else {
        assert.noFile([generator._stylesheetToCreateFilePath]);
      }
    });

    testUtils.testFileContentsByProp({
      testTrue: 'imports react-bootstrap',
      testFalse: 'does not import react-bootrap',
      prop: generator.props.bootstrap,
      file: generator._componentToCreateFilePath,
      content: "import * as B from 'react-bootstrap';"
    });

    testUtils.testFileContentsByProp({
      testTrue: 'import the stylesheet',
      testFalse: 'does not import the stylesheet',
      prop: generator.props.stylesheet,
      file: generator._componentToCreateFilePath,
      content: `import './${generator.props.name}.scss';`
    });

    testUtils.testFileContentsByProp({
      testTrue: 'imports react-hoc-loading',
      testFalse: 'does not import react-hoc-loading',
      prop: generator.props.reacthocloading,
      file: generator._componentToCreateFilePath,
      content: `import loading from 'react-hoc-loading';`
    });

    testUtils.testFileContentsByProp({
      testTrue: 'adds the Loading decorator',
      testFalse: 'does not add the Loading decorator',
      prop: generator.props.reacthocloading,
      file: generator._componentToCreateFilePath,
      content: `@loading()`
    });

    testUtils.testFileContentsByProp({
      testTrue: 'imports react-bootstrap-hoc-error',
      testFalse: 'does not import react-bootstrap-hoc-error',
      prop: generator.props.reactbootstraperror,
      file: generator._componentToCreateFilePath,
      content: `import errorable from 'react-bootstrap-hoc-error';`
    });

    testUtils.testFileContentsByProp({
      testTrue: 'adds the errorable decorator',
      testFalse: 'does not add the errorable decorator',
      prop: generator.props.reactbootstraperror,
      file: generator._componentToCreateFilePath,
      content: `@errorable()`
    });
  });

  if (generator.props.container) {
    container({
      runGenerator: false,
      componentName:
        generator.props.type === 'stateless'
          ? generator.props.name
          : _.upperFirst(generator.props.name),
      options: {
        name: generator.props.name,
        path: generator.props.path,
        component: generator._componentToCreateFilePath
      }
    });
  }
}

module.exports = testSuite;
