'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const extend = require('deep-extend');
const sharedOptions = require('../options');
const sharedPrompts = require('../prompts');

const shared = ['bootstrap', 'thunk', 'form'];

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    sharedOptions.include(this.option.bind(this), shared, this.log.bind(this));
  }
  initializing() {
    this.props = Object.assign({}, this.options);
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
  prompting() {
    this.log('');
    this.log(chalk.green('React & Redux') + ' generator. Feel free to contribute!');
    this.log('');

    return this.prompt(sharedPrompts.get(this.props, shared)).then(props => {
      this.props = extend(this.props, props);
      this.config.set({
        bootstrapEnabled: this.props.bootstrap,
        thunkEnabled: this.props.thunk,
        formsEnabled: this.props.form
      });
      this.config.save();
    });
  }
  writing() {
    this.fs.copy(this.templatePath('static/**'), this.destinationRoot());
    this.fs.copy(this.templatePath('static/**/.*'), this.destinationRoot());

    let pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    pkg = extend(pkg, this.fs.readJSON(this.templatePath('package.json'), {}));

    if (this.props.bootstrap) {
      pkg.dependencies['react-bootstrap'] = '^0.31.3';
    }
    if (this.props.thunk) {
      pkg.dependencies['redux-thunk'] = '^2.2.0';
    }
    if (this.props.form) {
      pkg.dependencies['redux-form'] = '^7.1.1';
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
