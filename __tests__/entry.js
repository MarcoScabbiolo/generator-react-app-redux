'use strict';
const entry = require('./entry/test.js');

entry(undefined, true);

describe('when the entry already exists', () => {
  entry(undefined, false, true);
});
