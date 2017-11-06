const assert = require('yeoman-assert');
const yeoman = require('yeoman-environment');
const adapters = require('yeoman-test/lib/adapter');
const extend = require('deep-extend');
const reactReduxEnvironment = require('../../generators/ReactReduxEnvironment');

function testFileContentsByProp({ testTrue, testFalse, prop, file, content }) {
  if (prop) {
    test(testTrue, () => {
      assert.fileContent(file, content);
    });
  } else {
    test(testFalse, () => {
      assert.noFileContent(file, content);
    });
  }
}

function generatorInstance(generator, options) {
  let env = yeoman.createEnv([], {}, new adapters.TestAdapter());
  env.register(generator);
  let gen = env.create(env.namespace(generator), options);
  gen.props = Object.assign({}, gen.props, options.options, options.prompts);
  return gen;
}

function testEnvironment(environmentClass, indexOptions = {}) {
  var env = (envPath, name) =>
    new (environmentClass(reactReduxEnvironment()))([envPath, name]);
  return [
    () => {
      let e = env('index', '');
      let options = { path: '', name: 'index', skipEntryDirectory: true };
      options = extend(options, indexOptions);
      e.forceConfiguration(options, {});
      return e;
    },
    () => env('bar', 'foo')
  ];
}

module.exports = {
  testFileContentsByProp,
  generatorInstance,
  testEnvironment
};
