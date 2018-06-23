'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const _ = require('lodash');
const types = require('babel-types');
const astUtils = require('../astUtils');
const environment = require('./Environment');
const isValidIdentifier = require('is-var-name');

const shared = ['path', 'bootstrap', 'reacthocloading', 'reactbootstraphocerror'];
const prompts = [
  {
    name: 'name',
    message: 'What will be the name of the new component?',
    validate: name =>
      isValidIdentifier(name) ||
      `${name} is not a valid identifier, it cannot be used as the name of the component`,
    when: props => !props.name
  },
  {
    name: 'type',
    message: 'What type of component do you need?',
    type: 'list',
    choices: [
      {
        value: 'standard',
        name: 'Standard'
      },
      {
        value: 'stateless',
        name: 'Stateless functional'
      },
      {
        value: 'section',
        name: 'Section component'
      }
    ],
    default: 'standard',
    when: props => !_.isString(props.type)
  },
  {
    name: 'container',
    type: 'confirm',
    default: true,
    message: 'Do you want to include a container for this component?',
    when: props => !_.isBoolean(props.container)
  },
  {
    name: 'stylesheet',
    type: 'confirm',
    default: false,
    message: 'Do you want to include a stylesheet for this component?',
    when: props => !_.isBoolean(props.stylesheet)
  },
  {
    name: 'reducer',
    type: 'confirm',
    default: true,
    message: 'Do you want to include a reducer for this section?',
    when: props => !_.isBoolean(props.reducer) && props.type === 'section',
    order: 2
  }
];

module.exports = class extends environment(ReactReduxGenerator) {
  constructor(args, options) {
    super(args, options, {
      shared,
      prompts,
      generatorName: 'Component'
    });

    this.option('type', {
      type: String,
      required: false,
      desc: 'The type of component'
    });
    this.option('container', {
      type: Boolean,
      required: false,
      desc: 'Include react-bootstrap in this component'
    });
    this.option('stylesheet', {
      type: Boolean,
      required: false,
      desc: 'Include a stylesheet with this component'
    });
    this.option('componentname', {
      type: String,
      required: false,
      desc: 'Provide a component name to be used instead of the name option/prompt'
    });
  }
  get _componentName() {
    let name = this.props.componentname || this.props.name;
    return this.props.type === 'stateless' ? _.lowerFirst(name) : _.upperFirst(name);
  }
  _renderMethod(classDeclaration) {
    return astUtils.findClassMethodDeclaration(classDeclaration, 'render');
  }
  _divElement(children = []) {
    return types.jSXElement(
      types.jSXOpeningElement(types.jSXIdentifier('div'), []),
      types.jSXClosingElement(types.jSXIdentifier('div')),
      children
    );
  }
  _thisRender(identifier, args = []) {
    return types.jSXExpressionContainer(
      types.callExpression(
        types.memberExpression(types.thisExpression(), types.identifier(identifier)),
        args
      )
    );
  }
  initializing() {
    this.props.sections = this.config.get('sections');
    return this._initializing();
  }
  prompting() {
    if (!this.props.sections) {
      this.reactReduxGeneratorOptions.prompts
        .find(p => p.name === 'type')
        .choices.splice(2, 1);
    }
    return this._prompting().then(() => {
      this.composeWith(require.resolve('../reducer'), {
        name: this.props.name,
        path: this.props.path,
        type: 'section',
        sectionReducerFilePath: this._resolveSectionsReducerFilePath(this.props.path)
      });
    });
  }
  writing() {
    let ast = astUtils.parse(this._templateByTypeContents);

    if (this.props.bootstrap) {
      ast = astUtils.importBootstrap(ast);
    }

    if (this.props.stylesheet) {
      ast = astUtils.newImport(
        ast,
        types.importDeclaration([], types.stringLiteral('./' + this.props.name + '.scss'))
      );
    }

    let exportDefaultDeclaration = astUtils.findDefaultExportDeclaration(ast);

    if (this.props.type === 'section') {
      if (this.props.reacthocloading || this.props.reactbootstraphocerror) {
        let classDeclaration = astUtils.findClassDeclaration(ast, 'NewComponent');
        if (!classDeclaration.decorators) {
          classDeclaration.decorators = [];
        }

        if (this.props.reacthocloading) {
          astUtils.newImport(
            ast,
            astUtils.singleSpecifierImportDeclaration('loading', 'react-hoc-loading', {
              isDefault: true
            })
          );

          classDeclaration.decorators.push(
            types.decorator(types.callExpression(types.identifier('loading'), []))
          );
        }
        if (this.props.reactbootstraphocerror) {
          astUtils.newImport(
            ast,
            astUtils.singleSpecifierImportDeclaration(
              'errorable',
              'react-bootstrap-hoc-error',
              {
                isDefault: true
              }
            )
          );

          classDeclaration.decorators.push(
            types.decorator(types.callExpression(types.identifier('errorable'), []))
          );
        }

        let returnStmt = astUtils.findReturnStatement(
          this._renderMethod(classDeclaration).body.body
        );

        if (types.isNullLiteral(returnStmt.argument)) {
          let toRender = [];
          if (this.props.reacthocloading) {
            toRender.push(this._thisRender('renderLoading'));
          }
          if (this.props.reactbootstraphocerror) {
            toRender.push(this._thisRender('renderError'));
          }
          returnStmt.argument = this._divElement(toRender);
        }
      }
    }

    if (this.props.type === 'stateless') {
      // Change function name
      astUtils.findSingleVariableDeclaration(
        ast,
        'const',
        'newComponent'
      ).declarations[0].id.name = this._componentName;

      // Change displayName
      let displayNameExpression = ast.program.body.find(
        stmt =>
          types.isExpressionStatement(stmt) &&
          types.isAssignmentExpression(stmt.expression) &&
          types.isMemberExpression(stmt.expression.left) &&
          stmt.expression.left.object.name === 'newComponent'
      ).expression;

      displayNameExpression.left.object.name = this._componentName;
      displayNameExpression.right.value = _.upperFirst(this._componentName);
      displayNameExpression.right.raw = `'${_.upperFirst(this._componentName)}'`;

      exportDefaultDeclaration.declaration.name = this._componentName;
    } else {
      // Change class name
      astUtils.findClassDeclaration(ast, 'NewComponent').id.name = this._componentName;

      exportDefaultDeclaration.declaration.name = this._componentName;
    }

    this.fs.write(
      this.destinationPath(this._componentToCreateFilePath),
      astUtils.generate(ast)
    );

    if (this.props.stylesheet) {
      this.fs.write(this.destinationPath(this._stylesheetToCreateFilePath), '\n');
    }

    if (this.props.container) {
      let state;

      if (this.props.type === 'section') {
        state = this._pathToReducerObjectNotationAst('sections');
      }

      this.composeWith(require.resolve('../container'), {
        name: this.props.name,
        path: this.props.path,
        component: this._componentToCreateFilePath,
        state,
        logScaffoldingPath: false
      });
    }
  }
};
