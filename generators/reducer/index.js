'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const extend = require('deep-extend');
const _ = require('lodash');
const sharedOptions = require('../options');
const sharedPrompts = require('../prompts');

const shared = ['path'];

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: false,
      desc: 'The name of the reducer'
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
    this.log(chalk.green('Reducer') + ' generator');
    this.log('');

    return this.prompt(
      [
        {
          name: 'name',
          message: 'What will be the name of the new reducer?',
          when: !this.props.name
        }
      ].concat(sharedPrompts.get(this.props, shared))
    ).then(props => {
      this.props = extend(this.props, props);
    });
  }
  writing() {}
};
