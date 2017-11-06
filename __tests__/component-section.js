'use strict';
const component = require('./component/test.js');

component({
  runGenerator: true,
  prompts: {
    name: 'test',
    path: 'generator_tests',
    type: 'section'
  },
  options: {
    bootstrap: true
  }
});
