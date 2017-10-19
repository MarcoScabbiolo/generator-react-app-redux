const _ = require('lodash');
const chalk = require('chalk');

const options = {
  bootstrap: {
    type: Boolean,
    required: false,
    desc: 'Use react-boostrap'
  },
  thunk: {
    type: Boolean,
    required: false,
    desc: 'Use redux-thunk'
  },
  path: {
    type: String,
    required: false,
    desc:
      'A path relative to the src directory. Note that many directories are created for each entry, taking into account the current working directory is not implemented yet'
  },
  form: {
    type: Boolean,
    required: false,
    desc: 'Use redux-form'
  }
};

options.getAll = function() {
  return _.entries(options).filter(option => !_.isFunction(option[1]));
};

options.include = function(config, param, log) {
  if (!_.isFunction(config)) {
    throw new TypeError(
      `options.include must be passed the config method of the Generator bound to the Generator itself as its first parameter, instead it was passed a ${typeof param}`
    );
  }

  if (_.isArray(param)) {
    var allOptions = options.getAll(),
      included = allOptions.filter(option => param.includes(option[0]));

    included.forEach(option => config(option[0], option[1]));

    if (_.isFunction(log) && included.length < param.length) {
      let notIncluded = param.filter(
        toBeIncluded => !allOptions.some(option => option[0] === toBeIncluded)
      );
      log(chalk.yellow(`Options ${notIncluded} do not exist and could not be included`));
    }
  } else if (_.isString(param)) {
    if (options.hasOwnProperty(param)) {
      config(param, options[param]);
    } else {
      throw new Error(`Shared option ${param} does not exist`);
    }
  } else {
    throw new TypeError(
      `options.include must be passed an option name or an array of option names as its seconds parameter, instead it was passed ${typeof options}`
    );
  }
};

module.exports = options;
