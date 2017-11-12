'use strict';
const reducer = require('./reducer/test.js');

jest.setTimeout(15000);

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
