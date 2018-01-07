'use strict';
const ReactReduxGenerator = require('../ReactReduxGenerator');
const chalk = require('chalk');
const extend = require('deep-extend');
const astUtils = require('../astUtils');
const types = require('babel-types');
const _ = require('lodash');

const shared = [
  'bootstrap',
  'thunk',
  'form',
  'normalizr',
  'reacthocloading',
  'reactbootstraphocerror',
  'reduxloaderror'
];

module.exports = class extends ReactReduxGenerator {
  constructor(args, options) {
    super(args, options, {
      shared,
      generatorName: 'React & Redux',
      logScaffoldingPath: true,
      prompts: [
        {
          name: 'webpackdashboard',
          message: 'Use webpack-dashboard?',
          type: 'confirm',
          default: false,
          store: true,
          when: props => !_.isBoolean(props.webpackdashboard)
        },
        {
          name: 'sections',
          message: 'Do you want to have dedicated reducers for every mayor UI component?',
          type: 'confirm',
          default: true,
          store: false,
          when: props => !_.isBoolean(props.sections),
          order: 2
        },
        {
          name: 'entities',
          message: 'Do you want to decouple your entities from the UI?',
          type: 'confirm',
          default: true,
          store: false,
          when: props => !_.isBoolean(props.entities),
          order: 5
        }
      ]
    });

    this.option('webpackdashboard', {
      type: Boolean,
      required: false,
      desc: 'Use webpack-dashboard'
    });
  }
  initializing() {
    return this._initializing();
  }
  prompting() {
    return this._prompting().then(() => {
      this.config.set({
        bootstrapEnabled: this.props.bootstrap,
        thunkEnabled: this.props.thunk,
        formsEnabled: this.props.form
      });
      this.config.save();

      this.composeWith(require.resolve('generator-node/generators/app'), {
        boilerplate: false,
        skipInstall: this.options.skipInstall,
        license: this.options.license
      });
      this.composeWith(require.resolve('../entry'), {
        name: 'main',
        bootstrap: this.props.bootstrap,
        thunk: this.props.thunk,
        normalizr: this.props.normalizr,
        form: this.props.form,
        reacthocloading: this.props.reacthocloading,
        reactbootstraphocerror: this.props.reactbootstraphocerror,
        reduxloaderror: this.props.reduxloaderror,
        path: '',
        sections: this.props.sections,
        entities: this.props.entities,
        skipEntryDirectory: true,
        logScaffoldingPath: false
      });
    });
  }
  _extendJSON(target, source, write = true) {
    source = source || target;
    let json = {};
    if (this.fs.exists(this.destinationPath(target))) {
      json = this.fs.readJSON(this.destinationPath(target), {});
    }
    json = extend(json, this.fs.readJSON(this.templatePath(source), {}));

    if (write) {
      this.fs.writeJSON(this.destinationPath(target), json);
    } else {
      return json;
    }
  }
  writing() {
    this.fs.copy(this.templatePath('static/**'), this.destinationRoot());

    let component = astUtils.parse(this.fs.read(this.templatePath('component.js')));

    if (this.props.bootstrap) {
      component = astUtils.newImport(
        component,
        types.importDeclaration(
          [],
          types.stringLiteral('../../node_modules/bootstrap/dist/css/bootstrap.css')
        )
      );
      component = astUtils.newImport(
        component,
        types.importDeclaration(
          [],
          types.stringLiteral('../../node_modules/bootstrap/dist/css/bootstrap-theme.css')
        )
      );
    }

    this.fs.write(
      this.destinationPath('src/components/App.js'),
      astUtils.generate(component)
    );

    let pkg = this._extendJSON('package.json', undefined, false);

    if (this.props.webpackdashboard) {
      pkg.devDependencies['webpack-dashboard'] = '^1.0.2';
      pkg.scripts.start = 'webpack-dashboard -- ' + pkg.scripts.start;
    }

    if (this.props.bootstrap) {
      pkg.dependencies['react-bootstrap'] = '^0.31.3';
      pkg.dependencies.bootstrap = '^3.3.7';
    }
    if (this.props.thunk) {
      pkg.dependencies['redux-thunk'] = '^2.2.0';
    }
    if (this.props.form) {
      pkg.dependencies['redux-form'] = '^7.1.1';
    }
    if (this.props.normalizr) {
      pkg.dependencies.normalizr = '^3.2.4';
    }
    if (this.props.reacthocloading) {
      pkg.dependencies['react-hoc-loading'] = '^1.0.7';
    }
    if (this.props.reactbootstraphocerror) {
      pkg.dependencies['react-bootstrap-hoc-error'] = '^0.1.3';
    }
    if (this.props.reduxloaderror) {
      pkg.dependencies['redux-load-error'] = '^1.0.2';
    }

    pkg.eslintConfig = {
      parser: 'babel-eslint',
      extends: ['plugin:react/recommended'],
      env: {
        browser: true
      }
    };

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    let webpack = this.fs.readJSON(this.templatePath('webpack-config.json'), {});
    webpack.dashboard = this.props.webpackdashboard;
    this.fs.writeJSON(this.destinationPath('webpack/config.json'), webpack);

    this._extendJSON('.babelrc');

    let gitignore = this.fs.read(this.destinationPath('.gitignore'));
    gitignore += 'dist/*\n';
    this.fs.write(this.destinationPath('.gitignore'), gitignore);
  }
  end() {
    if (this.props.reacthocloading) {
      this.log(
        `Dont forget to set your ${chalk.yellow(
          'default LoadingComponent'
        )}: https://github.com/MarcoScabbiolo/react-hoc-loading#set-a-default-loadingcomponent-globally-with-setdefaultloadingcomponent`
      );
    }
  }
};
