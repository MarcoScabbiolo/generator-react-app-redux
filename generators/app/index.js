'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const extend = require('deep-extend');
const dependencies = require('./dependencies');
const devDependencies = require('./dev-dependencies');
const _ = require('lodash');
const sharedOptions = require('../options');
const sharedPrompts = require('../prompts');

const shared = ['bootstrap', 'thunk', 'form'];

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    sharedOptions.include(this.option.bind(this), shared, this.log.bind(this));

    this.dependencies = dependencies;
    this.devDependencies = devDependencies;
  }
  initializing() {
    this.props = Object.assign({}, this.options);
  }
  prompting() {
    this.log('');
    this.log(chalk.green('React & Redux') + ' generator. Feel free to contribute!');
    this.log('');

    return this.prompt(sharedPrompts.get(this.props, shared)).then(props => {
      this.props = extend(this.props, props);
      this.config.set({
        bootstrapEnabled: this.props.bootstrap,
        thunkEnabled: this.props.thunk
      });
      this.config.save();
    });
  }
  default() {
    this.composeWith(require.resolve('generator-node/generators/app'), {
      boilerplate: false,
      skipInstall: this.options.skipInstall,
      license: this.options.license
    });
    this.composeWith(require.resolve('../entry'), {
      name: 'index',
      bootstrap: this.props.bootstrap,
      thunk: this.props.thunk,
      path: '',
      skipEntryDirectory: true
    });
  }

  _extendJSON(original, extensions, destinationPath) {
    var originalParsed = _.isString(original) ? this.fs.readJSON(original, {}) : original;
    extensions = _.isString(extensions) ? this.fs.readJSON(extensions, {}) : extensions;

    originalParsed = extend(originalParsed, extensions);
    this.fs.writeJSON(destinationPath || original, originalParsed);
  }
  writing() {
    this.fs.copy(this.templatePath('static/**'), this.destinationRoot());
    this.fs.copy(this.templatePath('static/**/.*'), this.destinationRoot());

    this._extendJSON(
      this.destinationPath('package.json'),
      this.templatePath('package.json')
    );
  }

  install() {
    if (this.props.bootstrap) {
      this.dependencies.push('react-bootstrap');
    }
    if (this.props.thunk) {
      this.dependencies.push('redux-thunk');
    }
    if (this.props.form) {
      this.dependencies.push('redux-form');
    }
    this.npmInstall(this.dependencies, { save: true });
    this.npmInstall(this.devDependencies, { 'save-dev': true });
  }
};
