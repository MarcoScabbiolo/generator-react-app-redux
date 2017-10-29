'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const environment = require('./Environment');
const chalk = require('chalk');
const esprima = require('esprima');
const astUtils = require('../astUtils');

const shared = ['bootstrap', 'thunk', 'path', 'normalizr'];
const prompts = [
  {
    name: 'name',
    message: 'What will be the name of the new entry?',
    when: function() {
      return !this.props.name;
    }
  }
];

module.exports = class extends environment(ReactReduxGenerator) {
  constructor(args, options) {
    super(args, options, {
      shared,
      prompts,
      generatorName: 'Entry'
    });

    this.option('skipEntryDirectory', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Do not create a directory for the entry and template files'
    });
  }

  initializing() {
    this._initializing();

    this.composeWith(require.resolve('../store'), {
      name: this.props.name,
      thunk: this.props.thunk,
      normalizr: this.props.normalizr,
      path: this.props.path
    });

    let actions = { app: 'app' };
    actions[this.props.name] = this._actionsPath;

    this.composeWith(require.resolve('../reducer'), {
      name: this.props.name,
      path: this.props.path,
      type: 'section',
      actions
    });
  }
  prompting() {
    return this._prompting();
  }
  validating() {
    if (this.fs.exists(this.destinationPath(this._jsEntryFilePath))) {
      this.log('');
      this.log(
        chalk.yellow('Entry ') +
          chalk.green(this.props.name) +
          chalk.yellow(' aldready exists, you cannot override an entry')
      );
      process.exit();
    }
  }
  _writeJSEntry() {
    let jsEntry = this.fs.read(this.templatePath('entry.js'));

    // We only parse the first to avoid issues with JSX
    let splittedJsEntry = jsEntry.split('// #__esprima-breakpoint__#');

    let ast = esprima.parseModule(splittedJsEntry[0]);

    // Import the main container
    ast = astUtils.newImport(
      ast,
      astUtils.importDefaultDeclaration('Main', this._defaultContainerPath)
    );
    // Import the store
    ast = astUtils.newImport(
      ast,
      astUtils.importDefaultDeclaration('configureStore', this._storePath)
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

    mainContainerPathVariable.declarations[0].init.value = this._defaultContainerPath;
    mainContainerPathVariable.declarations[0].init.raw = `'${this
      ._defaultContainerPath}'`;

    // Write the ast and the untouched part of the file
    this.fs.write(
      this.destinationPath(this._jsEntryFilePath),
      astUtils.generate(ast) + splittedJsEntry[1]
    );
  }
  _writeHTMLTemplate() {
    this.fs.copy(
      this.templatePath('static/index.ejs'),
      this.destinationPath(this._htmlEntryFilePath)
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

    this.fs.write(this.destinationPath('webpack/entries.js'), astUtils.generate(ast));
  }
};
