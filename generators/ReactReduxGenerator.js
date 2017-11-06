const sharedOptions = require('./options');
const sharedPrompts = require('./prompts');
const Generator = require('yeoman-generator');
const reactReduxEnvironment = require('./ReactReduxEnvironment');
const _ = require('lodash');
const extend = require('deep-extend');
const chalk = require('chalk');

// Yeoman doesn't deal very well with extending the base Generator so we augment the generators from their constructors
// That is, resorting to JS objects instead of classes
// To extend methods appended by this function you need to keep a reference to the old method and call it first in the new method
module.exports = class extends reactReduxEnvironment(Generator) {
  constructor(
    args,
    options,
    reactReduxGeneratorOptions = {
      shared: [],
      prompts: [],
      generatorName: 'A Generator'
    }
  ) {
    super(args, options);

    this.option('name', {
      type: String,
      required: false,
      desc: 'The name of the namespace'
    });

    this.reactReduxGeneratorOptions = reactReduxGeneratorOptions;

    sharedOptions.include(
      this.option.bind(this),
      reactReduxGeneratorOptions.shared,
      this.log.bind(this)
    );
  }
  _initializing() {
    this.props = Object.assign({}, this.options, this.props);
  }
  _prompting() {
    var that = this;

    this.log('');
    this.log(chalk.green(this.reactReduxGeneratorOptions.generatorName) + ' generator');
    this.log('');

    _.forIn(this.reactReduxGeneratorOptions.prompts, prompt => {
      prompt.when = prompt.when.bind(this);
    });

    return this.prompt(
      this.reactReduxGeneratorOptions.prompts.concat(
        sharedPrompts.get(this.props, this.reactReduxGeneratorOptions.shared)
      )
    ).then(props => {
      that.props = extend(that.props, props);
      if (_.isFunction(that.validating)) {
        that.validating();
      }
    });
  }
};