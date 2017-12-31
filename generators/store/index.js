'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const types = require('babel-types');
const assert = require('chai').assert;
const astUtils = require('../astUtils');
const sharedOptions = require('../options');

const shared = ['thunk', 'path', 'form', 'normalizr'];
const prompts = [
  {
    name: 'name',
    message: 'What will be the name of the new store?',
    when: props => !props.name
  }
];

module.exports = class extends ReactReduxGenerator {
  constructor(args, options) {
    super(args, options, {
      shared,
      prompts,
      generatorName: 'Store'
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'The name of the store'
    });

    sharedOptions.include(
      this.option.bind(this),
      ['sections', 'entities'],
      this.log.bind(this)
    );
  }
  initializing() {
    return this._initializing();
  }
  prompting() {
    return this._prompting().then(() => {
      if (!this.props.sections && !this.props.entities) {
        this.composeWith(require.resolve('../reducer'), {
          name: 'main',
          path: this._resolvedPath,
          type: 'simple',
          actions: this._relatedActions,
          logScaffoldingPath: false
        });
      }
    });
  }
  _writeEntitiesReducer() {
    let ast = astUtils.parse(this.fs.read(this.templatePath('entities.js')));

    // Import normalizr if included
    if (this.props.normalizr) {
      ast = astUtils.newImport(
        ast,
        types.importDeclaration(
          [
            types.importSpecifier(
              types.identifier('normalize'),
              types.identifier('normalize')
            ),
            types.importSpecifier(types.identifier('schema'), types.identifier('schema'))
          ],
          types.stringLiteral('normalizr')
        )
      );
    }

    // Write the entities reducer file
    this.fs.write(
      this.destinationPath(this._entitiesReducerFilePath),
      astUtils.generate(ast)
    );
  }
  _writeRootReducer() {
    let ast = astUtils.parse(this.fs.read(this.templatePath('root.js')));

    // Find the object containing the reducers to be combined
    let toCombine = astUtils.findSingleVariableDeclaration(ast, 'const', 'reducer')
      .declarations[0].init.arguments[0].properties;

    // Import redux-form if included
    if (this.props.form) {
      ast = astUtils.newImport(
        ast,
        astUtils.singleSpecifierImportDeclaration(['form', 'reducer'], 'redux-form')
      );

      toCombine.push(astUtils.shorthandProperty('form'));
    }

    if (this.props.sections) {
      // Import sections reducer
      ast = astUtils.newImport(
        ast,
        astUtils.singleSpecifierImportDeclaration('sections', this._sectionsReducerPath, {
          isDefault: true
        })
      );
      toCombine.push(astUtils.shorthandProperty('sections'));
    }

    if (this.props.entities) {
      // Import entities reducer
      ast = astUtils.newImport(
        ast,
        astUtils.singleSpecifierImportDeclaration('entities', this._entitiesReducerPath, {
          isDefault: true
        })
      );
      toCombine.push(astUtils.shorthandProperty('entities'));
    }

    if (!this.props.sections && !this.props.entities) {
      ast = astUtils.newImport(
        ast,
        astUtils.singleSpecifierImportDeclaration('main', this._reducerPath('main'), {
          isDefault: true
        })
      );
      toCombine.push(astUtils.shorthandProperty('main'));
    }

    // Write the root reducer file
    this.fs.write(
      this.destinationPath(this._rootReducerFilePath),
      astUtils.generate(ast)
    );
  }
  _writeStore() {
    let ast = astUtils.parse(this.fs.read(this.templatePath('store.js')));

    // Import the reducer
    ast = astUtils.newImport(
      ast,
      astUtils.singleSpecifierImportDeclaration('mainReducer', this._rootReducerPath, {
        isDefault: true
      })
    );

    // Import redux-thunk if included
    if (this.props.thunk) {
      ast = astUtils.newImport(
        ast,
        astUtils.singleSpecifierImportDeclaration('thunk', 'redux-thunk', {
          isDefault: true
        })
      );
    }
    // Find the middleware array
    let middlewareVariable = astUtils.findSingleVariableDeclaration(
      ast,
      'const',
      'middleware'
    );
    assert.isOk(
      middlewareVariable,
      'Could not find the declaration of the variable middleware in the store template'
    );

    assert(
      types.isArrayExpression(middlewareVariable.declarations[0].init),
      'The middleware variable declarations right side is not an ArrayExpression'
    );

    // Add the redux-thunk middleware if included
    if (this.props.thunk) {
      middlewareVariable.declarations[0].init.elements.push(
        types.callExpression(types.identifier('applyMiddleware'), [
          types.identifier('thunk')
        ])
      );
    }

    // Write the new store file
    this.fs.write(this.destinationPath(this._storeFilePath), astUtils.generate(ast));
  }
  writing() {
    if (this.props.sections) {
      // Copy sections reducer
      this.fs.copy(
        this.templatePath('static/sections.js'),
        this.destinationPath(this._sectionsReducerFilePath)
      );
    }

    if (this.props.entities) {
      this._writeEntitiesReducer();
    }
    this._writeRootReducer();
    this._writeStore();
  }
};
