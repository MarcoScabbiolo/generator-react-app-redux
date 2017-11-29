'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const _ = require('lodash');
const astUtils = require('../astUtils');
const environment = require('./Environment');
const types = require('babel-types');

const shared = ['path', 'reacthocloading'];
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
    this.option('sectionReducerFilePath', {
      type: String,
      required: false,
      desc:
        'The path to the sections reducer where the section reducer to create will be added to the combination'
    });
  }
  initializing() {
    return this._initializing();
  }
  prompting() {
    return this._prompting();
  }
  _findReducerCombination(ast) {
    return astUtils.findSingleVariableDeclaration(ast, 'const', 'reducer').declarations[0]
      .init.arguments[0].properties;
  }
  _addSection() {
    let destinationPath = this.destinationPath(this._secionsReducerToCombineWithFilePath);
    let ast = astUtils.parse(this.fs.read(destinationPath));

    ast = astUtils.newImport(
      ast,
      astUtils.singleSpecifierImportDeclaration(
        this.props.name,
        this._reducerToCreatePath,
        { isDefault: true }
      )
    );

    this._findReducerCombination(ast).push(astUtils.shorthandProperty(this.props.name));

    this.fs.write(destinationPath, astUtils.generate(ast));
  }
  _emptyActionsArrayConstDeclaration(identifier) {
    return types.variableDeclaration('const', [
      types.variableDeclarator(types.identifier(identifier), types.arrayExpression([]))
    ]);
  }
  _ifIncludesReplaceBaseStateBlock(declaration, alternate = undefined) {
    return types.ifStatement(
      types.callExpression(
        types.memberExpression(
          types.identifier(declaration.arrayIdentifier),
          types.identifier('includes')
        ),
        types.memberExpression(types.identifier('action'), types.identifier('type'))
      ),
      types.blockStatement([
        types.expressionStatement(
          types.assignmentExpression(
            '=',
            types.identifier('state'),
            types.objectExpression([
              types.spreadProperty(types.identifier('state')),
              ...declaration.properties
            ])
          )
        )
      ]),
      alternate
    );
  }
  writing() {
    let ast = astUtils.parse(this._templateByTypeContents);

    // Import all the included actions
    if (this.props.type !== 'composition' && this.props.actions) {
      _.forIn(this.props.actions, (filePath, name) => {
        ast = astUtils.newImport(
          ast,
          astUtils.singleSpecifierImportDeclaration(name, filePath, { isNamespace: true })
        );
      });
    }

    // Combine reducers
    if (this.props.type === 'composition' && this.props.reducers) {
      let combination = this._findReducerCombination(ast);

      ast = astUtils.importAll(ast, this.props.reducers, { isDefault: true }, name =>
        combination.push(astUtils.shorthandProperty(name))
      );
    }

    if (this.props.type === 'section') {
      this._addSection();

      if (this.props.reacthocloading) {
        ast.body.unshift(
          this._emptyActionsArrayConstDeclaration('loadingActions'),
          this._emptyActionsArrayConstDeclaration('notLoadingActions')
        );

        astUtils
          .findSingleVariableDeclaration(ast, 'const', 'initialState')
          .declarations.init.properties.push(
            types.objectProperty(types.identifier('loading'), types.booleanLiteral(false))
          );

        astUtils
          .findSingleVariableDeclaration(ast, 'const', 'reducer')
          .declarations.init.body.unshift(
            this._ifIncludesReplaceBaseStateBlock(
              {
                arrayIdentifier: 'loadingActions',
                properties: [
                  types.objectProperty(
                    types.identifier('loading'),
                    types.booleanLiteral(true)
                  )
                ]
              },
              this._ifIncludesReplaceBaseStateBlock({
                arrayIdentifier: 'notLoadingActions',
                properties: [
                  types.objectProperty(
                    types.identifier('loading'),
                    types.booleanLiteral(false)
                  )
                ]
              })
            )
          );
      }
    }

    this.fs.write(
      this.destinationPath(this._reducerToCreateFilePath),
      astUtils.generate(ast)
    );
  }
};
