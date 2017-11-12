'use strict';
const reducer = require('./reducer/test.js');

jest.setTimeout(15000);

reducer({
  runGenerator: true,
  options: {
    actions: {
      app: 'actions/app',
      other: 'actions/other'
    }
  },
  prompts: {
    name: 'test',
    path: 'generator_tests',
    type: 'section'
  }
});
