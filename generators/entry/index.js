'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const extend = require('deep-extend');
const _ = require('lodash');
const sharedOptions = require('../options');
const sharedPrompts = require('../prompts');
const esprima = require('esprima');
const escodegen = require('escodegen');
const astUtils = require('../astUtils');

const shared = ['bootstrap', 'thunk', 'path'];

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: false,
      desc: 'The name of the entry'
    });

    this.option('skipEntryDirectory', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Do not create a directory for the entry and template files'
    });

    sharedOptions.include(this.option.bind(this), shared, this.log.bind(this));

    this.props = {};

    if (_.isString(args)) {
      this.props.name = args;
    } else if (_.isArray(args) && args.length) {
      this.props.name = args[0];
      this.props.path = args[1];
    }
  }
  initializing() {
    this.props = Object.assign({}, this.options, this.props);
  }
  prompting() {
    this.log('');
    this.log(chalk.green('Entry') + ' generator');
    this.log('');

    return this.prompt(
      [
        {
          name: 'name',
          message: 'What will be the name of the new entry?',
          when: !this.props.name
        }
      ].concat(sharedPrompts.get(this.props, shared))
    ).then(props => {
      this.props = extend(this.props, props);
    });
  }
  default() {
    this.composeWith(require.resolve('../store'), {
      name: this.props.name,
      thunk: this.props.thunk,
      path: this.props.path
    });
  }
  _writeJSEntry() {
    let jsEntry = this.fs.read(this.templatePath('entry.js'));

    // We only parse the first to avoid issues with JSX
    let splittedJsEntry = jsEntry.split('// #__esprima-breakpoint__#');

    let ast = esprima.parseModule(splittedJsEntry[0]);
    let pathAndName = this.props.path + this.props.name;

    // Import the main container
    ast = astUtils.newImport(
      ast,
      astUtils.importDefaultDeclaration('Main', `containers/${pathAndName}`)
    );
    // Import the store
    ast = astUtils.newImport(
      ast,
      astUtils.importDefaultDeclaration('configureStore', `stores/${pathAndName}`)
    );

    // Set the main container path variable to be used by HMR
    let mainContainerPathVariable = astUtils.findSingleVariableDeclaration(
      ast,
      'const',
      'mainContainerPath'
    );

    if (!mainContainerPathVariable) {
      throw new Error(
        'Could not find the declaration of the variable mainContainerPath in the JS entry template'
      );
    }

    mainContainerPathVariable.declarations[0].init.value = 'containers/' + pathAndName;
    mainContainerPathVariable.declarations[0].init.raw = `'containers/${pathAndName}'`;

    // Write the ast and the untouched part of the file
    this.fs.write(
      this.destinationPath(this.props.name + '.js'),
      escodegen.generate(ast) + splittedJsEntry[1]
    );
  }
  _writeHTMLTemplate() {
    this.fs.copy(
      this.templatePath('static/index.ejs'),
      this.destinationPath(
        this.props.path +
          (this.props.skipEntryDirectory ? 'index.ejs' : `${this.props.name}/index.ejs`)
      )
    );
  }
  _entriesFileIncosistentError(details) {
    throw new Error(
      'Unable to edit the entries file in src/webpack/entries.js , you will have to manually add the JavaScript and HTML entries: ' +
        details
    );
  }
  writing() {
    this._writeJSEntry();
    this._writeHTMLTemplate();

    // Add the entry into the entries file
    let ast = esprima.parse(this.fs.read(this.destinationPath('webpack/entries.js')));

    // Check the consistency of the entries file so we dont break anything
    if (ast.type !== 'Program') {
      this._entriesFileIncosistentError('File does not contain a Program');
    }

    if (ast.body[0].type !== 'ExpressionStatement') {
      this._entriesFileIncosistentError('First statement must be an ExpressionStatement');
    }

    let expression = ast.body[0].expression;

    if (expression.type !== 'AssignmentExpression') {
      this._entriesFileIncosistentError('Expression must be an AssignmentExpression');
    }

    if (
      expression.left.type !== 'MemberExpression' ||
      !expression.left.object ||
      !expression.left.property ||
      expression.left.object.name !== 'module' ||
      expression.left.property.name !== 'exports'
    ) {
      this._entriesFileIncosistentError(
        'Left side of the assignment must be a MemberExpression for the object module and the property exports'
      );
    }

    if (expression.right.type !== 'ObjectExpression') {
      this._entriesFileIncosistentError(
        'Right side of the assignment must be an ObjectExpression'
      );
    }

    // Finally add the entry
    expression.right.properties.push(
      astUtils.stringLiteralProperty(this.props.name, this.props.name + '.js')
    );

    this.fs.write(this.destinationPath('webpack/entries.js'), escodegen.generate(ast));
  }
};
