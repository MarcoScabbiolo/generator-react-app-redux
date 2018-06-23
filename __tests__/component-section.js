'use strict';
const component = require('./component/test.js');
const fs = require('fs-extra');
const path = require('path');

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

component(
  {
    runGenerator: true,
    prompts: {
      name: 'test',
      path: 'generator_tests',
      type: 'section',
      container: false,
      bootstrap: false,
      reacthocloading: false,
      reactbootstraphocerror: false,
      reducer: true
    },
    options: {}
  },
  false,
  dir => {
    fs.mkdirpSync(path.join(dir, 'src/reducers/generator_tests'));
    fs.writeFileSync(
      path.join(dir, 'src/reducers/generator_tests/sections.js'),
      fs.readFileSync(
        path.join(__dirname, '../generators/store/templates/static/sections.js')
      )
    );
  }
);

component(
  {
    runGenerator: true,
    prompts: {
      name: 'test',
      type: 'section',
      container: false,
      bootstrap: false,
      reacthocloading: false,
      reactbootstraphocerror: false,
      reducer: true
    },
    options: {
      path: ''
    }
  },
  false,
  dir => {
    fs.mkdirpSync(path.join(dir, 'src/reducers'));
    fs.writeFileSync(
      path.join(dir, 'src/reducers/sections.js'),
      fs.readFileSync(
        path.join(__dirname, '../generators/store/templates/static/sections.js')
      )
    );
  }
);
