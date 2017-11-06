const path = require('path');
const _ = require('lodash');

class DummyBaseClass {}

module.exports = (BaseClass = DummyBaseClass) =>
  class extends BaseClass {
    constructor(args, ...rest) {
      super(args, ...rest);

      this.props = {};

      if (_.isString(args)) {
        this.props.name = args;
      } else if (_.isArray(args) && args.length) {
        this.props.name = args[0];
        this.props.path = args[1];
      }
    }
    get _resolvedPath() {
      return path.join(this.props.path, this.props.name);
    }
    get _jsEntryPath() {
      return path.join('src', this._resolvedPath);
    }
    get _jsEntryFilePath() {
      return this._jsEntryPath + '.js';
    }
    get _actionsPath() {
      return path.join('actions', this._resolvedPath);
    }
    get _actionsFilePath() {
      return path.join('src', this._actionsPath) + '.js';
    }
    get _rootReducerPath() {
      return path.join('reducers', this._resolvedPath);
    }
    get _rootReducerFilePath() {
      return path.join('src', this._rootReducerPath) + '.js';
    }
    get _entitiesReducerPath() {
      return path.join('reducers', this._resolvedPath, 'entities');
    }
    get _entitiesReducerFilePath() {
      return path.join('src', this._entitiesReducerPath) + '.js';
    }
    get _storePath() {
      return path.join('stores', this._resolvedPath);
    }
    get _storeFilePath() {
      return path.join('src', this._storePath) + '.js';
    }
    get _sectionsReducerPath() {
      return this._reducerPath('sections');
    }
    get _sectionsReducerFilePath() {
      return path.join('src', this._sectionsReducerPath) + '.js';
    }
    get _defaultSectionReducerPath() {
      return this._sectionReducersPath();
    }
    get _defaultSectionReducerFilePath() {
      return path.join('src', this._defaultSectionReducerPath, 'index.js');
    }
    get _defaultContainerPath() {
      return this._containersPath();
    }
    get _defaultContainerFilePath() {
      return path.join('src', this._defaultContainerPath, 'index.js');
    }
    _resolvePath(toJoin = '') {
      return path.join(this._resolvedPath, toJoin);
    }
    _reducerPath(toJoin) {
      return path.join('reducers', this._resolvePath(toJoin));
    }
    _reducerFilePath(toJoin) {
      return path.join('src', this._reducerPath(toJoin)) + '.js';
    }
    _sectionReducersPath(toJoin = '') {
      return path.join('reducers', this.props.path, this.props.name, 'sections', toJoin);
    }
    _sectionReducersDirectoryPath(toJoin) {
      return path.join('src', this._sectionReducersPath(toJoin));
    }
    _sectionReducersFilePath(toJoin) {
      return this._sectionReducersDirectoryPath(toJoin) + '.js';
    }
    _componentsPath(toJoin) {
      return path.join('components', this._resolvePath(toJoin));
    }
    _componentsDirectoryPath(toJoin) {
      return path.join('src', this._componentsPath(toJoin));
    }
    _componentsFilePath(toJoin) {
      return this._componentsDirectoryPath(toJoin) + '.js';
    }
    _containersPath(toJoin) {
      return path.join('containers', this._resolvePath(toJoin));
    }
    _containersDirectoryPath(toJoin) {
      return path.join('src', this._containersPath(toJoin));
    }
    _containersFilePath(toJoin) {
      return path.join('src', this._containersPath(toJoin)) + '.js';
    }

    forceConfiguration(options, prompts) {
      this.props = Object.assign({}, this.props, options, prompts);
    }
  };
