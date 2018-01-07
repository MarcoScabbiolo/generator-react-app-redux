'use strict';
const reducer = require('./reducer/test.js');
const fs = require('fs-extra');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const fixture = dir => {
  fs.writeFileSync(
    path.join(dir, 'sections_reducer.js'),
    `const reducer = combineReducers({ });`
  );
};

reducer(
  {
    runGenerator: true,
    options: {
      actions: {
        app: 'actions/app',
        other: 'actions/other'
      },
      sectionReducerFilePath: 'sections_reducer.js'
    },
    prompts: {
      name: 'test',
      path: 'generator_tests',
      type: 'section'
    }
  },
  true,
  fixture
);

describe('generator-react-app-redux:reducer-section code formatting', () => {
  test('generator runs', () =>
    helpers
      .run(path.join(__dirname, '../generators/reducer'))
      .withOptions({
        sectionReducerFilePath: 'sections_reducer.js',
        name: 'test',
        path: '',
        type: 'section',
        reduxloaderror: true
      })
      .inTmpDir(fixture));

  test('proper formatting', () => {
    assert.fileContent(
      'src/reducers/test/sections/test.js',
      `import loadErrorPreReducer from 'redux-load-error';

const loadingActions = [];
const notLoadingActions = [];
const errorActions = [];

const initialState = { loading: false };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default loadErrorPreReducer(
  reducer,
  loadingActions,
  notLoadingActions,
  errorActions
);
`
    );
  });
});
