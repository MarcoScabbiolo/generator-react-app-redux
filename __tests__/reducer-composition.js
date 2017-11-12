'use strict';
const reducer = require('./reducer/test.js');

reducer({
  runGenerator: true,
  options: {
    reducers: {
      main: 'reducers/main',
      other: 'reducers/main/other'
    }
  },
  prompts: {
    name: 'test',
    path: 'generator_tests',
    type: 'composition'
  }
});
