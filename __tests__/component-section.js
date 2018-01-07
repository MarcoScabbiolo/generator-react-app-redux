'use strict';
const component = require('./component/test.js');

component({
  runGenerator: true,
  prompts: {
    name: 'test',
    path: 'generator_tests',
    type: 'section',
    container: false,
    bootstrap: true,
    reacthocloading: false,
    reactbootstraphocerror: false
  },
  options: {}
});

component({
  runGenerator: true,
  prompts: {
    name: 'test',
    path: 'generator_tests',
    type: 'section',
    container: false,
    bootstrap: true,
    reacthocloading: true,
    reactbootstraphocerror: true
  },
  options: {}
});
