const _ = require('lodash');

const prompts = [
  {
    name: 'bootstrap',
    message: 'Use react-bootstrap?',
    type: 'confirm',
    default: false,
    store: true,
    when: props => !_.isBoolean(props.bootstrap)
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
    message: 'Where do you want to place it?',
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
    message: 'Use a HOC for components that can be loading?',
    name: 'reacthocloading',
    type: 'confirm',
    default: false,
    store: true,
    when: props =>
      !_.isBoolean(props.reacthocloading) &&
      (!props.type || props.type === 'section') &&
      (!_.isBoolean(props.sections) || props.sections),
    order: 3
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
      props.bootstrap &&
      (!props.type || props.type === 'section') &&
      (!_.isBoolean(props.sections) || props.sections),
    order: 3
  },
  {
    message:
      'Use a pre-reducer for mayor UI components to set them to set them to be loading or display an error?',
    name: 'reduxloaderror',
    type: 'confirm',
    default: false,
    store: true,
    when: props =>
      !_.isBoolean(props.reduxloaderror) && _.isBoolean(props.sections) && props.sections,
    order: 4
  },
  {
    name: 'normalizr',
    message: 'Use normalizr?',
    type: 'confirm',
    default: false,
    store: true,
    when: props => !_.isBoolean(props.normalizr) && props.entities,
    order: 6
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
