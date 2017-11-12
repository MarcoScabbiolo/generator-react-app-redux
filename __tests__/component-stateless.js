'use strict';
const component = require('./component/test.js');

component({
  runGenerator: true,
  prompts: {
    name: 'test',
    path: 'generator_tests',
    type: 'stateless',
    bootstrap: false
  },
  options: {}
});
