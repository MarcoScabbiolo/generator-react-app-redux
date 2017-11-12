'use strict';
const entry = require('./entry/test.js');

jest.setTimeout(25000);

entry(undefined, true);

describe('when the entry already exists', () => {
  entry(undefined, false, true);
});
