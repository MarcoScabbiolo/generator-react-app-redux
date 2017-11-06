'use strict';
const reactReduxEnvironment = require('../generators/ReactReduxEnvironment');
require('should');

const e = (path = '', name = '') => new (reactReduxEnvironment())([name, path]);
const index = () => e('', 'index');
const foo = () => e('foo', 'bar');

describe('react-redux environment', () => {
  it('js entry', () => {
    index()._jsEntryPath.should.equal('src/index');
    index()._jsEntryFilePath.should.equal('src/index.js');
    foo()._jsEntryPath.should.equal('src/foo/bar');
    foo()._jsEntryFilePath.should.equal('src/foo/bar.js');
  });

  it('actions path', () => {
    index()._actionsPath.should.equal('actions/index');
    index()._actionsFilePath.should.equal('src/actions/index.js');
    foo()._actionsPath.should.equal('actions/foo/bar');
    foo()._actionsFilePath.should.equal('src/actions/foo/bar.js');
  });

  it('root reducer path', () => {
    index()._rootReducerPath.should.equal('reducers/index');
    index()._rootReducerFilePath.should.equal('src/reducers/index.js');
    foo()._rootReducerPath.should.equal('reducers/foo/bar');
    foo()._rootReducerFilePath.should.equal('src/reducers/foo/bar.js');
  });
});
