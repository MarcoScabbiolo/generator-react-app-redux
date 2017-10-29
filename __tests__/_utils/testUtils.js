const assert = require('yeoman-assert');
const yeoman = require('yeoman-environment');
const adapters = require('yeoman-test/lib/adapter');

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

module.exports = {
  testFileContentsByProp,
  generatorInstance
};
