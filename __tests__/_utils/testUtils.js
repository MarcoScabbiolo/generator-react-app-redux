const assert = require('yeoman-assert');
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
  testEnvironment
};
