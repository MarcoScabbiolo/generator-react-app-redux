const _ = require('lodash');

const prompts = [
  {
    name: 'bootstrap',
    message: 'Use react-bootstrap?',
    type: 'confirm',
    default: false,
    store: true,
    when: props => !_.isBoolean(props.bootstrap),
    order: 1
  },
  {
    name: 'thunk',
    message: 'Use redux-thunk?',
    type: 'confirm',
    default: true,
    store: true,
    when: props => !_.isBoolean(props.thunk)
  },
  {
    name: 'path',
    message: 'Where do you want to place it? Insert a path relative to the src directory',
    when: props => !_.isString(props.path)
  },
  {
    name: 'form',
    message: 'Use redux-form?',
    type: 'confirm',
    default: true,
    store: true,
    when: props => !_.isBoolean(props.form)
  },
  {
    name: 'normalizr',
    message: 'Use normalizr?',
    type: 'confirm',
    default: false,
    store: true,
    when: props => !_.isBoolean(props.normalizr)
  },
  {
    message: 'Use a HOC for components that can be loading?',
    name: 'reacthocloading',
    type: 'confirm',
    default: false,
    store: true,
    when: props =>
      !_.isBoolean(props.reacthocloading) && (!props.type || props.type === 'section')
  },
  {
    message: 'Use a HOC for components that can have an error?',
    name: 'reactbootstraphocerror',
    type: 'confirm',
    default: false,
    store: true,
    when: props =>
      !_.isBoolean(props.reactbootstraphocerror) &&
      _.isBoolean(props.bootstrap) &&
      props.bootstrap,
    order: 2
  }
];

prompts.bindToProps = (toBind, props) => {
  if (!toBind) {
    return;
  }
  if (_.isArray(toBind)) {
    return toBind.map(prompt =>
      Object.assign({}, prompt, {
        when: prompt.when && prompt.when(props)
      })
    );
  }
  return Object.assign({}, toBind, {
    when: toBind.when && toBind.when(props)
  });
};

prompts.get = function(param) {
  if (_.isString(param)) {
    return prompts.find(prompt => param === prompt.name);
  } else if (_.isArray(param)) {
    return prompts.filter(prompt => param.includes(prompt.name));
  }
  throw new TypeError(
    `prompts.get must receive a prompt name or an array of prompt names as its first parameter, instead it received a ${typeof param}`
  );
};

module.exports = prompts;
