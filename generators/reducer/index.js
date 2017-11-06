'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const _ = require('lodash');
const types = require('babel-types');
const astUtils = require('../astUtils');
const environment = require('./Environment');

const shared = ['path'];
const prompts = [
  {
    name: 'name',
    message: 'What will be the name of the new reducer?',
    when: function() {
      return !this.props.name;
    }
  },
  {
    name: 'type',
    message: 'What type of reducer do you need?',
    type: 'list',
    choices: [
      {
        value: 'simple',
        name: 'Simple reducer'
      },
      {
        value: 'section',
        name: 'New section'
      },
      {
        value: 'compositon',
        name: 'Combination of other reducers'
      }
    ],
    default: 'simple',
    when: function() {
      return !this.props.type;
    }
  }
];

module.exports = class extends environment(ReactReduxGenerator) {
  constructor(args, options) {
    super(args, options, {
      shared,
      prompts,
      generatorName: 'Reducer'
    });

    this.option('type', {
      type: String,
      required: false,
      desc: 'The type of reducer'
    });
    this.option('actions', {
      type: Object,
      required: false,
      desc:
        'Object of actions to import. The key is the local identifier and the value is the path to the file'
    });
    this.option('reducers', {
      type: Object,
      required: false,
      desc:
        'Object of reducers to import. The key is the local identifier and the key of the reducer in the combination and the value is the path to the file'
    });
  }
  initializing() {
    return this._initializing();
  }
  prompting() {
    return this._prompting();
  }
  get _templateContents() {
    return this.fs.read(this.templatePath(`${this.props.type}.js`));
  }
  writing() {
    let ast = astUtils.parse(this._templateContents);

    // Import all the included actions
    if (this.props.type !== 'composition' && this.props.actions) {
      _.forIn(this.props.actions, (filePath, name) => {
        ast = astUtils.newImport(
          ast,
          types.importDeclaration(
            [types.importNamespaceSpecifier(types.identifier(name))],
            types.stringLiteral(filePath)
          )
        );
      });
    }

    // Combine reducers
    if (this.props.type === 'composition' && this.props.reducers) {
      let combination = astUtils.findSingleVariableDeclaration(ast, 'const', 'reducer')
        .declarations[0].init.arguments[0].properties;

      _.forIn(this.props.reducers, (filePath, name) => {
        // Import the reducer
        ast = astUtils.newImport(
          ast,
          types.importDeclaration(
            [types.importDefaultSpecifier(types.identifier(name))],
            types.stringLiteral(filePath)
          )
        );
        // Combine it
        combination.push(astUtils.shorthandProperty(name));
      });
    }

    this.fs.write(
      this.destinationPath(this._reducerToCreateFilePath),
      astUtils.generate(ast)
    );
  }
};
