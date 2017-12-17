const sharedOptions = require('./options');
const sharedPrompts = require('./prompts');
const Generator = require('yeoman-generator');
const reactReduxEnvironment = require('./ReactReduxEnvironment');
const _ = require('lodash');
const extend = require('deep-extend');
const chalk = require('chalk');
const assert = require('chai').assert;

// Yeoman doesn't deal very well with extending the base Generator so we augment the generators from their constructors
// That is, resorting to JS objects instead of classes
// To extend methods appended by this function you need to keep a reference to the old method and call it first in the new method
module.exports = class extends reactReduxEnvironment(Generator) {
  constructor(args, options, reactReduxGeneratorOptions) {
    super(args, options);

    this.option('name', {
      type: String,
      required: false,
      desc: 'The name of the namespace'
    });

    this.reactReduxGeneratorOptions = reactReduxGeneratorOptions;

    if (!this.reactReduxGeneratorOptions.prompts) {
      this.reactReduxGeneratorOptions.prompts = [];
    }

    sharedOptions.include(
      this.option.bind(this),
      reactReduxGeneratorOptions.shared,
      this.log.bind(this)
    );
  }
  get _templateByTypeContents() {
    assert.isString(this.props.type, `Property 'type' of the generator must be a string`);
    return this.fs.read(this.templatePath(`${this.props.type}.js`));
  }
  _invalidateFile(message, filePath, exists = true) {
    this.log('');
    this.log(message);
    this.env.error(`File ${filePath} ${exists ? 'exists' : 'does not exist'}. Aborting`);
  }
  _fileDoesNotExistError(filePath, message) {
    this._invalidateFile(message + chalk.yellow(' does not exist.'), filePath, false);
  }
  _fileExistsError(filePath, message) {
    this._invalidateFile(message + chalk.yellow(' already exists.'), filePath);
  }
  _initializing() {
    this.props = Object.assign({}, this.options, this.props);
    if (this.props.logScaffoldingPath) {
      this.log('Scaffolding in ' + chalk.yellow(this.destinationPath()));
    }
  }
  _prompting() {
    this.log('');
    this.log(chalk.green(this.reactReduxGeneratorOptions.generatorName) + ' generator');
    this.log('');

    let prompts = this.reactReduxGeneratorOptions.prompts
      .concat(sharedPrompts.get(this.reactReduxGeneratorOptions.shared))
      .map(p => {
        p.order = p.order || 1;
        return p;
      });

    prompts = new Map(
      Array.from(new Set(prompts.map(p => p.order))).map(o => [
        o,
        prompts.filter(p => p.order === o)
      ])
    );

    return Array.from(prompts.keys())
      .sort()
      .reduce(
        (promise, order) =>
          promise.then(lastPrompts => {
            if (lastPrompts) {
              this.props = extend(this.props, lastPrompts);
            }

            return this.prompt(sharedPrompts.bindToProps(prompts.get(order), this.props));
          }),
        Promise.resolve(undefined)
      )
      .then(last => {
        this.props = extend(this.props, last);
        if (_.isFunction(this.validating)) {
          this.validating();
        }
      });
  }
};
