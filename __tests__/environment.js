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

  it('entities reducer path', () => {
    index()._entitiesReducerPath.should.equal('reducers/index/entities');
    index()._entitiesReducerFilePath.should.equal('src/reducers/index/entities.js');
    foo()._entitiesReducerPath.should.equal('reducers/foo/bar/entities');
    foo()._entitiesReducerFilePath.should.equal('src/reducers/foo/bar/entities.js');
  });

  it('store path', () => {
    index()._storePath.should.equal('stores/index');
    index()._storeFilePath.should.equal('src/stores/index.js');
    foo()._storePath.should.equal('stores/foo/bar');
    foo()._storeFilePath.should.equal('src/stores/foo/bar.js');
  });

  it('sections reducer path', () => {
    index()._sectionsReducerPath.should.equal('reducers/index/sections');
    index()._sectionsReducerFilePath.should.equal('src/reducers/index/sections.js');
    foo()._sectionsReducerPath.should.equal('reducers/foo/bar/sections');
    foo()._sectionsReducerFilePath.should.equal('src/reducers/foo/bar/sections.js');
  });

  it('default section reducer path', () => {
    index()._defaultSectionReducerPath.should.equal('reducers/index/sections');
    index()._defaultSectionReducerFilePath.should.equal(
      'src/reducers/index/sections/index.js'
    );
    foo()._defaultSectionReducerPath.should.equal('reducers/foo/bar/sections');
    foo()._defaultSectionReducerFilePath.should.equal(
      'src/reducers/foo/bar/sections/index.js'
    );
  });

  it('default container path', () => {
    index()._defaultContainerPath.should.equal('containers/index');
    index()._defaultContainerFilePath.should.equal('src/containers/index/index.js');
    foo()._defaultContainerPath.should.equal('containers/foo/bar');
    foo()._defaultContainerFilePath.should.equal('src/containers/foo/bar/index.js');
  });

  it('resolve reducer path', () => {
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

  it('resolve section reducer path', () => {
    index()
      ._sectionReducersPath('asection')
      .should.equal('reducers/index/sections/asection');
    index()
      ._sectionReducersDirectoryPath('asection')
      .should.equal('src/reducers/index/sections/asection');
    index()
      ._sectionReducersFilePath('asection')
      .should.equal('src/reducers/index/sections/asection.js');
    foo()
      ._sectionReducersPath('asection')
      .should.equal('reducers/foo/bar/sections/asection');
    foo()
      ._sectionReducersDirectoryPath('asection')
      .should.equal('src/reducers/foo/bar/sections/asection');
    foo()
      ._sectionReducersFilePath('asection')
      .should.equal('src/reducers/foo/bar/sections/asection.js');
  });

  it('resolve component path', () => {
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

  it('resolve container path', () => {
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
});
