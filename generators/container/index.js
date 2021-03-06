'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const chalk = require('chalk');
const types = require('babel-types');
const astUtils = require('../astUtils');
const environment = require('./Environment');
const _ = require('lodash');

const shared = ['path'];
const prompts = [
  {
    name: 'name',
    message: 'What will be the name of the new container?',
    when: props => !props.name
  },
  {
    name: 'component',
    message: 'The path to the component to contain',
    when: props => !props.component
  }
];

module.exports = class extends environment(ReactReduxGenerator) {
  constructor(args, options) {
    super(args, options, {
      shared,
      prompts,
      generatorName: 'Container'
    });

    this.option('actions', {
      type: Object,
      required: false,
      desc:
        'The actions to import, the key is the local name and the value is the path to the file to import'
    });
    this.option('component', {
      type: String,
      required: false,
      desc: 'The path to the component to contain'
    });
    this.option('state', {
      type: Object,
      required: false,
      desc: 'An expression that will be the body of the mapStateToProps arrow function'
    });
  }
  get _componentName() {
    return _.upperFirst(
      astUtils.findDefaultExportDeclaration(
        astUtils.parse(this.fs.read(this.props.component))
      ).declaration.name
    );
  }
  initializing() {
    return this._initializing();
  }
  prompting() {
    return this._prompting();
  }
  validating() {
    if (!this.fs.exists(this.props.component)) {
      this._fileDoesNotExistError(
        this.props.component,
        chalk.yellow('Component ') + chalk.red(this.props.component)
      );
    }
  }
  writing() {
    let ast = astUtils.parse(this.fs.read(this.templatePath('container.js')));
    let componentName = this._componentName;

    if (this.props.actions) {
      ast = astUtils.importAll(ast, this.props.actions, { isNamespace: true });
    }

    ast = astUtils.newImport(
      ast,
      astUtils.singleSpecifierImportDeclaration(componentName, this._componentsPath(), {
        isDefault: true
      })
    );

    let exportDefault = astUtils.findDefaultExportDeclaration(ast);

    exportDefault.declaration.arguments.push(types.identifier(componentName));

    if (this.props.state) {
      exportDefault.declaration.callee.arguments[0].body = this.props.state;
    }

    this.fs.write(
      this.destinationPath(this._containerToCreateFilePath),
      astUtils.generate(ast)
    );
  }
};
