'use strict';
const types = require('babel-types');
const reactReduxEnvironment = require('../generators/ReactReduxEnvironment');
require('chai').should();

const e = (path = '', name = '') => new (reactReduxEnvironment())([name, path]);
const index = () => e('', 'index');
const foo = () => e('foo', 'bar');

describe('react-redux environment', () => {
  test('js entry', () => {
    index()._jsEntryPath.should.equal('src/index');
    index()._jsEntryFilePath.should.equal('./src/index.js');
    foo()._jsEntryPath.should.equal('src/foo/bar');
    foo()._jsEntryFilePath.should.equal('./src/foo/bar.js');
  });

  test('name only', () => {
    new (reactReduxEnvironment())('test')._jsEntryFilePath.should.equal('./src/test.js');
  });

  test('actions path', () => {
    index()._actionsPath.should.equal('actions/index');
    index()._actionsFilePath.should.equal('src/actions/index.js');
    foo()._actionsPath.should.equal('actions/foo/bar');
    foo()._actionsFilePath.should.equal('src/actions/foo/bar.js');
  });

  test('root reducer path', () => {
    index()._rootReducerPath.should.equal('reducers/index');
    index()._rootReducerFilePath.should.equal('src/reducers/index.js');
    foo()._rootReducerPath.should.equal('reducers/foo/bar');
    foo()._rootReducerFilePath.should.equal('src/reducers/foo/bar.js');
  });

  test('entities reducer path', () => {
    index()._entitiesReducerPath.should.equal('reducers/index/entities');
    index()._entitiesReducerFilePath.should.equal('src/reducers/index/entities.js');
    foo()._entitiesReducerPath.should.equal('reducers/foo/bar/entities');
    foo()._entitiesReducerFilePath.should.equal('src/reducers/foo/bar/entities.js');
  });

  test('store path', () => {
    index()._storePath.should.equal('stores/index');
    index()._storeFilePath.should.equal('src/stores/index.js');
    foo()._storePath.should.equal('stores/foo/bar');
    foo()._storeFilePath.should.equal('src/stores/foo/bar.js');
  });

  test('sections reducer path', () => {
    index()._sectionsReducerPath.should.equal('reducers/sections');
    index()._sectionsReducerFilePath.should.equal('src/reducers/sections.js');
    foo()._sectionsReducerPath.should.equal('reducers/foo/sections');
    foo()._sectionsReducerFilePath.should.equal('src/reducers/foo/sections.js');
  });

  test('default section reducer path', () => {
    index()._defaultSectionReducerPath.should.equal('reducers/sections');
    index()._defaultSectionReducerFilePath.should.equal('src/reducers/sections/index.js');
    foo()._defaultSectionReducerPath.should.equal('reducers/foo/sections');
    foo()._defaultSectionReducerFilePath.should.equal(
      'src/reducers/foo/sections/index.js'
    );
  });

  test('default container path', () => {
    index()._defaultContainerPath.should.equal('containers/index');
    index()._defaultContainerFilePath.should.equal('src/containers/index/index.js');
    foo()._defaultContainerPath.should.equal('containers/foo/bar');
    foo()._defaultContainerFilePath.should.equal('src/containers/foo/bar/index.js');
  });

  test('resolve reducer path', () => {
    index()
      ._reducerPath('reducer')
      .should.equal('reducers/index/reducer');
    index()
      ._reducerFilePath('reducer')
      .should.equal('src/reducers/index/reducer.js');
    foo()
      ._reducerPath('reducer')
      .should.equal('reducers/foo/bar/reducer');
    foo()
      ._reducerFilePath('reducer')
      .should.equal('src/reducers/foo/bar/reducer.js');
  });

  test('resolve section reducer path', () => {
    index()
      ._sectionReducersPath('asection')
      .should.equal('reducers/sections/asection');
    index()
      ._sectionReducersDirectoryPath('asection')
      .should.equal('src/reducers/sections/asection');
    index()
      ._sectionReducersFilePath('asection')
      .should.equal('src/reducers/sections/asection.js');
    foo()
      ._sectionReducersPath('asection')
      .should.equal('reducers/foo/sections/asection');
    foo()
      ._sectionReducersDirectoryPath('asection')
      .should.equal('src/reducers/foo/sections/asection');
    foo()
      ._sectionReducersFilePath('asection')
      .should.equal('src/reducers/foo/sections/asection.js');
  });

  test('resolve component path', () => {
    index()
      ._componentsPath('component')
      .should.equal('components/index/component');
    index()
      ._componentsDirectoryPath('component')
      .should.equal('src/components/index/component');
    index()
      ._componentsFilePath('component')
      .should.equal('src/components/index/component.js');
    foo()
      ._componentsPath('component')
      .should.equal('components/foo/bar/component');
    foo()
      ._componentsDirectoryPath('component')
      .should.equal('src/components/foo/bar/component');
    foo()
      ._componentsFilePath('component')
      .should.equal('src/components/foo/bar/component.js');
  });

  test('resolve container path', () => {
    index()
      ._containersPath('container')
      .should.equal('containers/index/container');
    index()
      ._containersDirectoryPath('container')
      .should.equal('src/containers/index/container');
    index()
      ._containersFilePath('container')
      .should.equal('src/containers/index/container.js');
    foo()
      ._containersPath('container')
      .should.equal('containers/foo/bar/container');
    foo()
      ._containersDirectoryPath('container')
      .should.equal('src/containers/foo/bar/container');
    foo()
      ._containersFilePath('container')
      .should.equal('src/containers/foo/bar/container.js');
  });

  test('resolve reducer object notation', () => {
    index()
      ._pathToReducerObjectNotation()
      .should.equal('state');
    index()
      ._pathToReducerObjectNotation('sections')
      .should.equal('state.sections');
    foo()
      ._pathToReducerObjectNotation()
      .should.equal('state.foo.bar');
    foo()
      ._pathToReducerObjectNotation('sections')
      .should.equal('state.sections.foo.bar');
  });

  test('resolve reducer object notation ast', () => {
    let ast = foo()._pathToReducerObjectNotationAst();

    ast.should
      .satisfy(types.isMemberExpression)
      .and.have.property('property')
      .that.has.property('name', 'bar');
    ast.should.have
      .property('object')
      .that.satisfies(types.isMemberExpression)
      .and.has.property('object')
      .that.has.property('name', 'state');
    ast.object.should.have.property('property').that.has.property('name', 'foo');
  });
});
